import { useRef, useState } from "react";
import axios from "axios";

export default function ChatbotAi() {
    const queryRef = useRef<HTMLInputElement>(null);
    const photoRef = useRef<HTMLInputElement>(null);
    const [response, setResponse] = useState<any>(null);
   
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const query = queryRef.current?.value;
        const photo = photoRef.current?.files?.[0];
        if (!query || !photo) return;

        const formData = new FormData();
        formData.append("query", query);
        formData.append("photo", photo);

        try {
            const res = await axios.post("/api/chatbot", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setResponse(res.data);
            console.log(res.data);
        } catch (err) {
            setResponse({ error: "something went wrong!" });
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col">
            <div>ChatbotAi</div>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept="image/*"
                    ref={photoRef}
                    required
                />
                <input
                    className="text-black"
                    type="text"
                    required
                    placeholder="query"
                    ref={queryRef}
                />
                <button type="submit">Submit</button>
            </form>
            {response && (
                <pre className="bg-gray-100 p-2 mt-2 rounded text-black">
                      {JSON.stringify(response, null, 2)}
                </pre>
            )}
        </div>
    );
}