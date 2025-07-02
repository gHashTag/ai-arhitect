#!/usr/bin/env node

const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function verifyAssistant() {
  const assistantId = process.env.OPENAI_ASSISTANT_ID;
  console.log(`🔍 Verifying assistant: ${assistantId}`);
  
  try {
    const assistant = await openai.beta.assistants.retrieve(assistantId);
    console.log('✅ Assistant verified successfully!');
    console.log(`   ID: ${assistant.id}`);
    console.log(`   Name: ${assistant.name}`);
    console.log(`   Model: ${assistant.model}`);
    console.log(`   Instructions: ${assistant.instructions?.substring(0, 100)}...`);
    
    console.log('\n🎯 Ready to update Railway environment variables:');
    console.log(`OPENAI_ASSISTANT_ID=${assistantId}`);
    console.log(`OPENAI_API_KEY=${process.env.OPENAI_API_KEY}`);
    
  } catch (error) {
    console.error('❌ Error verifying assistant:', error.message);
    process.exit(1);
  }
}

verifyAssistant();
