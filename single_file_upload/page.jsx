'use client'
import React, { useState } from 'react'

export default function Page (props) {
  const [file, setFile] = React.useState(null)
  const [progress, setProgress] = React.useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState(false)

  const handelFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', 'http://localhost:8000/api/upload', true)
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = Math.round((event.loaded * 100) / event.total)
        setProgress(percentage)
      }
    }
    xhr.onload = () => {
      if (xhr.status === 200) {
        setUploadSuccess('File uploaded successfully.')
      }
    }
    xhr.onerror = () => {
      setUploadError('Error uploading file')
    }

    xhr.send(formData)
  }

  return (
    <>
      <input type="file" name="image" onChange={handelFileChange}/>
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
        className={`px-4 py-2 bg-blue-500 text-white rounded 
                ${!file ? 'bg-opacity-50 cursor-not-allowed' : ''}`}
      >
        {uploadSuccess ? 'Uploaded' : 'Upload'}
      </button>

      {uploadSuccess && (
        <p className="text-green-500 mt-2">File uploaded successfully!</p>
      )}

      {uploadError && (
        <p className="text-red-500 mt-2">File uploaded file!</p>
      )}


    </>
  )
}

