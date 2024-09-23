'use client'
import React, { useState } from 'react'

export default function page () {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [files, setFiles] = useState([null, null])
  const [progress, setProgress] = useState([0, 0])
  const [uploadSuccess, setUploadSuccess] = useState([false, false])

  const handleFileChange = (file, index, progressValue) => {
    const newFiles = [...files]
    newFiles[index] = file
    setFiles(newFiles)

    const newProgress = [...progress]
    newProgress[index] = progressValue
    setProgress(newProgress)
  }

  const handleUploadComplete = (message, index) => {
    const newUploadSuccess = [...uploadSuccess]
    newUploadSuccess[index] = message
    setUploadSuccess(newUploadSuccess)
  }

  return (
    [1, 2].map((_, index) => (
      <FileUpload
        key={index}
        file={files[index]}
        progress={progress[index]}
        uploadSuccess={uploadSuccess[index]}
        onFileChange={(file, progressValue) => handleFileChange(file, index,
          progressValue)}
        onUploadComplete={(message) => handleUploadComplete(message, index)}

      />
    ))
  )
}

function FileUpload ({
  file,
  progress,
  uploadSuccess,
  onFileChange,
  onUploadComplete,
}) {

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', 'http://localhost:8000/api/upload', true)
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = Math.round((event.loaded * 100) / event.total)
        onFileChange(file, percentage)
      }
    }
    xhr.onload = () => {
      if (xhr.status === 200) {
        onUploadComplete('\'File uploaded successfully.\'')
      }
    }
    xhr.onerror = () => {
      console.log('Error uploading file')
    }

    xhr.send(formData)
  }

  return (
    <>
      <input type="file" name="image"
             onChange={(event) => onFileChange(event.target.files[0], 0)}/>
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

      <button
        onClick={handleUpload}
        disabled={!file}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {uploadSuccess ? 'Uploaded' : 'Upload'}
      </button>

      {uploadSuccess && (
        <p className="text-green-500 mt-2">File uploaded successfully!</p>
      )}

    </>
  )
}
