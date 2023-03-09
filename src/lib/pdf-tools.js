import PdfPrinter from "pdfmake"
import fetch from "node-fetch"
import { Buffer } from "buffer"
import createHttpError from "http-errors";

const getImageDataURL = async (imageUrl) => {
    try{
        const response = await fetch(imageUrl);
        if(!response.ok){
            next(createHttpError(404, `Blog post image not found`))
        }
        const buffer = await response.buffer();
        const dataUrl = `data:${response.headers.get('content-type')};base64,${buffer.toString('base64')}`;
        return dataUrl;
    }catch(error){
        console.error(error);
    }
  };

export const getPDFReadableStream = async blogPost => {
  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  }
  const imageUrl = blogPost.cover;
  const imageDataUrl = await getImageDataURL(imageUrl);
  const printer = new PdfPrinter(fonts)
  const docDefinition = {
    content: [
        { 
            image: imageDataUrl,
            fit:[250,250]
        },
        { text: blogPost.title, style:'header'},
        { text: blogPost.category, style: 'subHeader' },
        blogPost.content
    ],
    defaultStyle: {
      font: "Helvetica",
    },
    styles: {
        header: {
          fontSize: 22,
          bold: true
        },
        subHeader: {
          fontSize: 18,
          italics: true,
          bold:true
        }
      }
  };


  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {})
  pdfReadableStream.end()

  return pdfReadableStream
}
