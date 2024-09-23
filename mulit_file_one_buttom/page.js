'use client'
import React, { useState } from 'react'

export default function page () {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [files, setFiles] = useState([null, null])
  const [progress, setProgress] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState()

  const handleUpload = async () => {
    console.log(files) // Assuming `files` is an array of file objects
    const formData = new FormData()

    // Append each file individually
    for (let i = 0; i < files.length; i++) {
      formData.append('files[]', files[i])  // Use 'files[]' to send as an array
    }

    const xhr = new XMLHttpRequest()
    xhr.open('POST', `http://localhost:8000/api/upload`, true)

    // Track upload progress for all files
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = Math.round((event.loaded * 100) / event.total)
        setProgress(percentage)
      }
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        setUploadSuccess('File(s) uploaded successfully.')
      } else {
        console.log('Error:', xhr.responseText)
      }
    }

    xhr.onerror = () => {
      console.log('Error uploading file')
    }

    xhr.send(formData)
  }

  const handleFileChange = (file, index, progressValue) => {
    const newFiles = [...files]
    newFiles[index] = file
    setFiles(newFiles)
  }

  return (
    <>
      {
        [1, 2].map((_, index) => (
          <FileUpload
            key={index}
            onFileChange={(file) => handleFileChange(file, index)}
          />
        ))
      }

      {progress > 0 && (
        <div className="mt-4">
          <p>Upload Progress: {progress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {uploadSuccess && (
        <p className="text-green-500 mt-2">File uploaded successfully!</p>
      )}


      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {uploadSuccess ? 'Uploaded' : 'Upload'}
      </button>
    </>

  )
}

function FileUpload ({ onFileChange }) {
  return (
    <>
      <input type="file" name="image"
             onChange={(event) => onFileChange(event.target.files[0])}/>
    </>
  )
}
