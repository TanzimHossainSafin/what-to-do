import { useRef, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface ChatbotResponse {
  google?: {
    answers?: string[];
  };
  error?: string;
}

export default function ChatbotAi() {
    const queryRef = useRef<HTMLInputElement>(null);
    const photoRef = useRef<HTMLInputElement>(null);
    const [response, setResponse] = useState<ChatbotResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemovePhoto = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (photoRef.current) photoRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const query = queryRef.current?.value;
        const photo = selectedFile;
        if (!query || !photo) return;

        const formData = new FormData();
        formData.append("query", query);
        formData.append("photo", photo);
        setLoading(true);
        setCopied(false);
        try {
            const res = await axios.post("/api/chatbot", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setResponse(res.data);
        } catch {
            setResponse({ error: "something went wrong!" });
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (response?.google?.answers?.[0]) {
            navigator.clipboard.writeText(response.google.answers[0]);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <form className="flex flex-col gap-3 w-full max-w-md bg-white/90 shadow-xl rounded-xl p-6" onSubmit={handleSubmit}>
                {!previewUrl ? (
                    <input
                        type="file"
                        accept="image/*"
                        ref={photoRef}
                        required
                        className="mb-2"
                        onChange={handlePhotoChange}
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 mb-2">
                        <Image
                            src={previewUrl}
                            alt="Preview"
                            width={320}
                            height={160}
                            className="max-h-40 rounded-lg border border-gray-300 shadow"
                            unoptimized
                        />
                        <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-xs font-semibold"
                        >
                            Remove
                        </button>
                    </div>
                )}
                <input
                    className="text-black p-3 rounded-md border-2 border-gray-300"
                    type="text"
                    required
                    placeholder="Type your question..."
                    ref={queryRef}
                />
                <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Submit"}
                </button>
            </form>
            <div className="w-full max-w-md mt-4">
                {loading && (
                    <div className="flex justify-center items-center py-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    </div>
                )}
                {response?.google?.answers?.[0] && (
                    <div className="relative bg-gray-100 p-4 rounded-lg mt-2 font-mono text-base text-black shadow transition-all duration-300 overflow-x-auto">
                        <span>{response.google.answers[0]}</span>
                        <button
                            onClick={handleCopy}
                            className="absolute top-2 right-2 bg-green-200 hover:bg-green-300 text-green-800 px-2 py-1 rounded text-xs"
                        >
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                )}
                {response?.error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mt-2">{response.error}</div>
                )}
            </div>
        </div>
    );
}