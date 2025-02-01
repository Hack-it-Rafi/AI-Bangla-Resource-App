import { useState } from "react";
import axios from "axios";

const RealHome = () => {
  const [inputType, setInputType] = useState("file");
  const [fileType, setFileType] = useState("pdf");
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [output, setOutput] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileSubmit = async () => {
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          `http://localhost:3000/api/v1/${fileType}/add-file`,
          formData
        );
        setOutput(
          response.data.data.translatedContent
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleTextSubmit = async () => {
    setIsUploading(true);
    const blob = new Blob([textInput], { type: "text/plain" });
    const formData = new FormData();
    formData.append("file", blob, "textfile.txt");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/text/add-file",
        formData
      );
      setOutput(
        response.data.data.translatedContent.response.candidates[0].content
          .parts[0].text
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 text-[#F7F7F7]">
      <div className="mockup-window bg-[#6A1E55] border shadow-lg">
        <div className="bg-black flex justify-center h-[700px] px-4 py-16">
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-4xl text-white font-bold mb-4">
              Welcome to the File Manager
            </h1>
            <p className="text-white text-lg mb-6">
              Please upload a file or enter text to get started
            </p>
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setInputType("file")}
                className="btn bg-[#6A1E55] text-white border-none hover:bg-[#a12e81]"
                disabled={isUploading}
              >
                Upload File
              </button>
              <button
                onClick={() => setInputType("text")}
                className="btn"
                disabled={isUploading}
              >
                Enter Text
              </button>
            </div>
            {inputType === "file" && (
              <div className="flex flex-col items-center space-y-4">
                <select
                  className="select select-bordered w-full h-10 max-w-xs bg-[#F7F7F7] text-black"
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  disabled={isUploading}
                >
                  <option value="pdf">PDF</option>
                  <option value="mp3">MP3</option>
                  <option value="mp4">MP4</option>
                </select>
                <input
                  type="file"
                  className="file-input text-black bg-[#F7F7F7] w-full max-w-xs"
                  accept={`.${fileType}`}
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                <button
                  onClick={handleFileSubmit}
                  className="btn bg-[#6A1E55] text-white border-none hover:bg-[#a12e81]"
                  disabled={isUploading}
                >
                  Submit File
                </button>
              </div>
            )}
            {inputType === "text" && (
              <div className="flex flex-col items-center space-y-4">
                <textarea
                  className="textarea h-[300px] text-black mt-4 w-[400px]"
                  placeholder="Enter your text here..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  disabled={isUploading}
                ></textarea>
                <button
                  onClick={handleTextSubmit}
                  className="btn bg-[#6A1E55] text-white border-none hover:bg-[#a12e81]"
                  disabled={isUploading}
                >
                  Submit Text
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mockup-window bg-[#A64D79] border">
        <div className="bg-black h-[700px] px-4 py-5 overflow-auto">
          {output ? (
            <pre className="text-white whitespace-pre-wrap">{output}</pre>
          ) : (
            <div className="text-white">Output will be displayed here...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealHome;
