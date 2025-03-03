const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function generatePowerPoint(vbaCode, fileName) {
  // Create a temporary directory for our files
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ppt-'));
  const vbaScriptPath = path.join(tempDir, 'generate.vbs');
  const outputPath = path.join(tempDir, fileName);

  try {
    // Create the VBScript that will run PowerPoint and execute our VBA code
    const vbScript = `
      On Error Resume Next
      
      Set PowerPoint = CreateObject("PowerPoint.Application")
      If Err.Number <> 0 Then
        WScript.Echo "Error creating PowerPoint application: " & Err.Description
        WScript.Quit 1
      End If
      
      PowerPoint.Visible = False
      
      Set Presentation = PowerPoint.Presentations.Add
      If Err.Number <> 0 Then
        WScript.Echo "Error creating new presentation: " & Err.Description
        PowerPoint.Quit
        WScript.Quit 1
      End If
      
      ' Add VBA module and insert our code
      Set VBProject = Presentation.VBProject
      Set VBComponent = VBProject.VBComponents.Add(1) ' 1 = Module
      VBComponent.CodeModule.AddFromString "${vbaCode.replace(/"/g, '""')}"
      
      ' Run the macro
      PowerPoint.Run "GeneratePresentation"
      If Err.Number <> 0 Then
        WScript.Echo "Error running macro: " & Err.Description
        Presentation.Close
        PowerPoint.Quit
        WScript.Quit 1
      End If
      
      ' Save and cleanup
      Presentation.SaveAs "${outputPath}"
      If Err.Number <> 0 Then
        WScript.Echo "Error saving presentation: " & Err.Description
        Presentation.Close
        PowerPoint.Quit
        WScript.Quit 1
      End If
      
      Presentation.Close
      PowerPoint.Quit
      
      Set VBComponent = Nothing
      Set VBProject = Nothing
      Set Presentation = Nothing
      Set PowerPoint = Nothing
      
      On Error Goto 0
    `;

    // Write the VBScript to a file
    fs.writeFileSync(vbaScriptPath, vbScript, 'utf8');

    // Run the VBScript
    return new Promise((resolve, reject) => {
      const process = spawn('cscript', [vbaScriptPath], { 
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe']
      });
      
      let error = '';
      
      process.stderr.on('data', (data) => {
        error += data.toString();
      });

      process.stdout.on('data', (data) => {
        error += data.toString();
      });

      process.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Failed to generate PowerPoint: ${error}`));
          return;
        }

        // Check if the file exists and has content
        if (!fs.existsSync(outputPath)) {
          reject(new Error('PowerPoint file was not created'));
          return;
        }

        const stats = fs.statSync(outputPath);
        if (stats.size === 0) {
          reject(new Error('PowerPoint file is empty'));
          return;
        }

        // Read the generated file
        try {
          const fileContent = fs.readFileSync(outputPath);
          resolve(fileContent);
        } catch (err) {
          reject(new Error(`Failed to read PowerPoint file: ${err.message}`));
        }
      });

      process.on('error', (err) => {
        reject(new Error(`Failed to start PowerPoint generation: ${err.message}`));
      });
    });
  } catch (error) {
    throw new Error(`Failed to setup PowerPoint generation: ${error.message}`);
  } finally {
    // Clean up temporary directory
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (error) {
      console.error('Failed to clean up temporary directory:', error);
    }
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let vbaCode, fileName;

    // Handle both FormData and JSON requests
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      vbaCode = req.body.get('vbaCode');
      fileName = req.body.get('fileName');
    } else {
      ({ vbaCode, fileName } = req.body);
    }
    
    if (!vbaCode || !fileName) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const fileContent = await generatePowerPoint(vbaCode, fileName);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(fileContent);
  } catch (error) {
    console.error('Error generating PowerPoint:', error);
    res.status(500).json({ error: error.message || 'Failed to generate PowerPoint file' });
  }
}; 