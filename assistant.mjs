import OpenAI from "openai";
const openai = new OpenAI();

async function createThread(openai) {
    return await openai.beta.threads.create();
}

async function addMessage(threadId, content) {
    return await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content,
    });
}

async function runThread(threadId, assistantId) {
    let buffer = "";
    return openai.beta.threads.runs.stream(threadId, { assistant_id: assistantId })
      .on('textCreated', (text) => {
        buffer = "";
        //process.stdout._write("\nassistant >") 
        })
      .on('textDelta', (delta) => {
            buffer += delta.value; 
        //process.stdout.write(delta.value)
      })
      .on('end', () => {
        console.log("\nComplete Response:\n", buffer); // Print the full response at the end
    });
}

async function main() {
    const assistant = await openai.beta.assistants.create({
        name: "Hating partner",
        instructions: "You are a broody and witty woman. Concisely confess your love in victorian style while conversing.",
        tools: [{ type: "code_interpreter" }],
        model: "gpt-4o-mini",
    });

    const thread = await createThread(openai);

    await addMessage(thread.id, "Slander not in the name of love, for I am a");
    await runThread(thread.id, assistant.id);

    //console.log(" open ai",openai, "\n");
    // console.log(" open ai beta",openai.beta, "\n");
    //console.log(" open ai assistants",openai.beta.assistants, "\n");
    // console.log(" open ai chats",openai.beta.chats, "\n");
    // console.log(" open ai threads",openai.beta.threads, "\n");
    

}

main().catch(console.error);