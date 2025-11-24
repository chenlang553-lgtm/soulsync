import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Define the schema for structured analysis output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "对话基调的简短总结（中文）。" },
    title: { type: Type.STRING, description: "这段对话记录的简短、有创意的标题（中文）。" },
    sentimentTrend: {
      type: Type.ARRAY,
      description: "代表对话流程的数据点。将文本分为5-10个逻辑片段。",
      items: {
        type: Type.OBJECT,
        properties: {
          index: { type: Type.INTEGER },
          label: { type: Type.STRING, description: "时间段或片段名称（例如：'开始'、'冲突'、'和解'）（中文）。" },
          userScore: { type: Type.NUMBER, description: "用户（发送者）的情感得分，-10（消极）到 10（积极）。" },
          partnerScore: { type: Type.NUMBER, description: "伴侣（接收者）的情感得分，-10（消极）到 10（积极）。" },
          intimacyScore: { type: Type.NUMBER, description: "此阶段的感知亲密度，0-100。" }
        },
        required: ["index", "label", "userScore", "partnerScore", "intimacyScore"]
      }
    },
    currentIntimacy: { type: Type.NUMBER, description: "整体计算的亲密度得分 0-100。" },
    partnerPsychology: { type: Type.STRING, description: "深入剖析伴侣的心理状态和隐藏情绪（中文）。" },
    myPsychology: { type: Type.STRING, description: "分析用户的情感状态（中文）。" },
    relationshipAdvice: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5条针对用户的可执行建议（中文）。"
    },
    keyTopics: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "讨论的主要话题（中文）。"
    }
  },
  required: ["summary", "title", "sentimentTrend", "currentIntimacy", "partnerPsychology", "myPsychology", "relationshipAdvice", "keyTopics"]
};

export const analyzeChatText = async (chatText: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `你是一位专业的关系心理学家和数据分析师。
      请分析以下两个人之间的聊天记录。假设 '我' (Me) 或者第一个发言者是“用户”，另一个人是“伴侣”。
      
      聊天记录：
      ${chatText.substring(0, 15000)} 
      // 为了避免 Token 限制截取前 15000 字。
      
      请提供深度的心理学分析，并必须使用中文输出。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "你是一位专业、富有同理心且洞察力敏锐的情感咨询师。请严格输出 JSON 格式，并确保所有文本内容为中文。",
      }
    });

    const text = response.text;
    if (!text) throw new Error("AI 没有响应");

    const data = JSON.parse(text);
    
    return {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString('zh-CN'),
      ...data
    };
  } catch (error) {
    console.error("分析失败", error);
    throw error;
  }
};

export const getConsultationResponse = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: history,
    config: {
      systemInstruction: "你是 'SoulSync AI'，一位温暖、专业且富有同理心的情感治疗师。你提供简洁、可执行且温柔的建议。你帮助用户理解他们的情绪以及伴侣的视角。请始终使用中文进行对话。",
    }
  });

  const result = await chat.sendMessageStream({ message });
  return result;
};