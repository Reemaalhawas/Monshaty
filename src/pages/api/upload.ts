import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import Papa from 'papaparse';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });
    
    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileContent = fs.readFileSync(file.filepath, 'utf-8');
    
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          return res.status(400).json({ 
            error: 'Error parsing CSV file',
            details: results.errors 
          });
        }

        // Clean up the temporary file
        fs.unlinkSync(file.filepath);

        // Send the parsed data
        res.status(200).json({
          headers: results.meta.fields,
          data: results.data
        });
      },
      error: (error) => {
        // Clean up the temporary file
        fs.unlinkSync(file.filepath);
        res.status(500).json({ error: error.message });
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process file' });
  }
} 