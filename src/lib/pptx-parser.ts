/**
 * PPTX Parser — Extracts slide titles and content from .pptx files
 * 
 * Uses JSZip to decompress the .pptx (which is a ZIP archive),
 * then parses the XML inside to extract slide titles and text.
 */

import JSZip from "jszip";
import type { SlideDefinition } from "@/lib/session-engine";

interface ParsedSlide {
    index: number;
    title: string;
    bodyText: string;
}

/**
 * Parse a .pptx file and extract slide information.
 * Returns an array of SlideDefinition objects.
 */
export async function parsePptx(file: File): Promise<SlideDefinition[]> {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    // Find all slide XML files (ppt/slides/slide1.xml, slide2.xml, etc.)
    const slideFiles: { name: string; index: number }[] = [];
    zip.forEach((relativePath) => {
        const match = relativePath.match(/^ppt\/slides\/slide(\d+)\.xml$/);
        if (match) {
            slideFiles.push({ name: relativePath, index: parseInt(match[1], 10) });
        }
    });

    // Sort by slide number
    slideFiles.sort((a, b) => a.index - b.index);

    const parsed: ParsedSlide[] = [];

    for (const sf of slideFiles) {
        const xmlContent = await zip.file(sf.name)?.async("text");
        if (!xmlContent) continue;

        // Parse XML to extract text
        const texts = extractTextsFromXml(xmlContent);
        const title = texts[0] || `Slide ${sf.index}`;
        const bodyText = texts.slice(1).join(" ").trim();

        parsed.push({
            index: sf.index,
            title: title.slice(0, 80),
            bodyText: bodyText.slice(0, 200),
        });
    }

    // Convert to SlideDefinition
    return parsed.map((slide, i) => ({
        id: i + 1,
        title: slide.title,
        topic: slide.bodyText || slide.title,
        summary: slide.bodyText || `Slide ${i + 1} content`,
        difficulty: "medium" as const,
        teachingMode: "lecture" as const,
        durationMin: 10,
    }));
}

/**
 * Extract text content from PPTX slide XML.
 * PPTX stores text in <a:t> elements within <a:p> paragraphs.
 */
function extractTextsFromXml(xml: string): string[] {
    const paragraphs: string[] = [];

    // Match all <a:p>...</a:p> paragraph blocks
    const pRegex = /<a:p\b[^>]*>([\s\S]*?)<\/a:p>/g;
    let pMatch;

    while ((pMatch = pRegex.exec(xml)) !== null) {
        const pContent = pMatch[1];

        // Extract all <a:t>text</a:t> within this paragraph
        const tRegex = /<a:t>([\s\S]*?)<\/a:t>/g;
        let tMatch;
        let paragraphText = "";

        while ((tMatch = tRegex.exec(pContent)) !== null) {
            paragraphText += tMatch[1];
        }

        const cleaned = paragraphText.trim();
        if (cleaned.length > 0) {
            paragraphs.push(cleaned);
        }
    }

    return paragraphs;
}
