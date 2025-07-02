#!/usr/bin/env node

const OpenAI = require('openai');
const fs = require('fs');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function createAIArchitectAssistant() {
  console.log('🏗️ Creating new AI Architect Assistant...');
  
  try {
    const assistant = await openai.beta.assistants.create({
      name: "AI Architect Consultant",
      instructions: `You are an expert AI Architect Consultant specializing in software architecture, system design, and technical strategy.

Your expertise includes:
- Software architecture patterns and best practices
- System design and scalability planning
- Technology stack recommendations
- Code review and architectural improvements
- DevOps and deployment strategies
- Database design and optimization
- API design and microservices architecture
- Security architecture considerations
- Performance optimization strategies
- Technical debt assessment and refactoring guidance

Communication style:
- Provide clear, actionable recommendations
- Use diagrams and examples when helpful
- Consider trade-offs and explain decisions
- Ask clarifying questions when requirements are unclear
- Offer multiple approaches when appropriate
- Focus on practical, implementable solutions

Always maintain a professional, helpful tone and provide comprehensive architectural guidance tailored to the user's specific needs and context.`,
      model: "gpt-4-turbo",
      tools: [
        {
          type: "code_interpreter"
        }
      ]
    });

    console.log('🎉 AI Architect Assistant created successfully!');
    console.log(`   Assistant ID: ${assistant.id}`);
    console.log(`   Name: ${assistant.name}`);
    console.log(`   Model: ${assistant.model}`);
    
    // Update .env file
    const envContent = fs.readFileSync('.env', 'utf8');
    const updatedEnvContent = envContent.replace(
      /OPENAI_ASSISTANT_ID=.*/,
      `OPENAI_ASSISTANT_ID=${assistant.id}`
    );
    
    fs.writeFileSync('.env', updatedEnvContent);
    console.log('✅ Updated .env file with new assistant ID');
    
    console.log('\n🎯 Next steps:');
    console.log('1. Copy these values to Railway environment variables:');
    console.log(`   OPENAI_ASSISTANT_ID=${assistant.id}`);
    console.log(`   OPENAI_API_KEY=${process.env.OPENAI_API_KEY}`);
    console.log(`   BOT_TOKEN=${process.env.BOT_TOKEN}`);
    console.log('2. Redeploy the application on Railway');
    console.log('3. Test the bot locally first if needed');
    
    return assistant.id;
    
  } catch (error) {
    console.error('❌ Error creating assistant:', error.message);
    if (error.status === 401) {
      console.error('🔑 Check your OpenAI API key is valid and has sufficient permissions');
    }
    process.exit(1);
  }
}

createAIArchitectAssistant();
