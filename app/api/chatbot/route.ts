import axios from "axios";
import { NextResponse } from "next/server";
import FormData from "form-data";
import fs from "fs";

export const POST = async (req: Request) => {
  // ফ্রন্টএন্ড থেকে আসা FormData পড়ুন
  const formData = await req.formData();
  const file = formData.get("photo") as File; // ফ্রন্টএন্ডে photo নামে পাঠানো হচ্ছে
  const query = formData.get("query") as string;

  // ফাইলটা টেম্প ফাইলে লিখুন
  const buffer = Buffer.from(await file.arrayBuffer());
  const tempPath = `/tmp/${file.name}`;
  fs.writeFileSync(tempPath, buffer);

  // EdenAI-তে পাঠানোর জন্য FormData বানান
  const edenForm = new FormData();
  edenForm.append("providers", "google");
  edenForm.append("file", fs.createReadStream(tempPath));
  edenForm.append("question", query);

  try {
    const result = await axios.post(
      "https://api.edenai.run/v2/image/question_answer",
      edenForm,
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_AUTH_HEADER}`,
          ...edenForm.getHeaders(),
        },
      }
    );
    fs.unlinkSync(tempPath); // টেম্প ফাইল ডিলিট করুন
    return NextResponse.json(result.data);
  } catch (error: any) {
    fs.unlinkSync(tempPath);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};