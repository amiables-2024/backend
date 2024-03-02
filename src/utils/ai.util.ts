import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
    organization: process.env.OPENAI_ORG,
});

export const extractTodosFromSpec = async (spec: string): Promise<any[]> => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are super skilled at analysing a project's requirements or specifications and determining what needs to be done and creating very specific, minute tasks that could easily be assigned to individuals to get a project underway. You read project specifications, and always reply in the form of a JSON array with JSON objects that have the following fields: name, description."
                },
                {
                    role: "user",
                    content: spec
                },
            ],
        });
        const answer = response.choices[0].message.content;
        console.log(answer);
        const array = JSON.parse(answer);
        if (Array.isArray(array))
            return array;
        else
            return [];
    } catch (error) {
        console.error(error);
        return [];
    }
}