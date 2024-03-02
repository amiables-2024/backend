import fs from "fs";
import PDFParser from "pdf2json";

export const extractTextFromPdfBuffer = (buffer: Buffer): Promise<string> => {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(this, 1);

        pdfParser.on("pdfParser_dataError", (errData) => {
            console.error(errData);
            reject(errData);
        });

        pdfParser.on("pdfParser_dataReady", (pdfData) => {
            const context = (pdfParser as any).getRawTextContent();
            resolve(context);
        });

        pdfParser.parseBuffer(buffer);
    });
}