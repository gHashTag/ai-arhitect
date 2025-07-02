#!/usr/bin/env node

const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function checkAndCreateAssistant() {
  console.log('🔍 Checking existing assistants...');
  
  try {
    // Список существующих помощников
    const assistants = await openai.beta.assistants.list();
    console.log(`📋 Found ${assistants.data.length} assistants:`);
    
    assistants.data.forEach((assistant, index) => {
      console.log(`${index + 1}. ID: ${assistant.id}`);
      console.log(`   Name: ${assistant.name || 'Unnamed'}`);
      console.log(`   Description: ${assistant.description || 'No description'}`);
      console.log('---');
    });

    // Проверяем текущий ID из .env
    const currentId = process.env.OPENAI_ASSISTANT_ID;
    console.log(`\n🎯 Current assistant ID in .env: ${currentId}`);
    
    if (currentId) {
      try {
        const currentAssistant = await openai.beta.assistants.retrieve(currentId);
        console.log('✅ Current assistant found and accessible!');
        console.log(`   Name: ${currentAssistant.name}`);
        return currentId;
      } catch (error) {
        console.log('❌ Current assistant ID not found or inaccessible');
        console.log('   Error:', error.message);
      }
    }

    // Создаем нового помощника
    console.log('\n🛠️ Creating new AI Architect Assistant...');
    
    const newAssistant = await openai.beta.assistants.create({
      name: "AI Architect Bot",
      instructions: `You are an AI Architect Bot designed to help with software architecture, design patterns, and technical consultations.

Your key responsibilities:
1. Provide architectural guidance and best practices
2. Help with system design decisions
3. Suggest design patterns and technologies
4. Review and improve existing architectures
5. Answer technical questions about software development

Always respond in a helpful, professional manner and provide practical, actionable advice.`,
      model: "gpt-4-turbo",
      tools: [
        {
          type: "code_interpreter"
        }
      ]
    });

    console.log('🎉 New assistant created successfully!');
    console.log(`   Assistant ID: ${newAssistant.id}`);
    console.log(`   Name: ${newAssistant.name}`);
    
    // Обновляем .env файл
    const fs = require('fs');
    const envContent = fs.readFileSync('.env', 'utf8');
    const updatedEnvContent = envContent.replace(
      /OPENAI_ASSISTANT_ID=.*/,
      `OPENAI_ASSISTANT_ID=${newAssistant.id}`
    );
    
    fs.writeFileSync('.env', updatedEnvContent);
    console.log('✅ Updated .env file with new assistant ID');
    
    return newAssistant.id;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Запускаем проверку
checkAndCreateAssistant()
  .then((assistantId) => {
    console.log(`\n🎯 Assistant ID to use: ${assistantId}`);
    console.log('\n📝 Next steps:');
    console.log('1. Update Railway environment variable OPENAI_ASSISTANT_ID');
    console.log('2. Redeploy the application');
    console.log('3. Check for any running Telegram bot instances to avoid 409 conflicts');
  })
  .catch(console.error);
