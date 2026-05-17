# Moodal

:contentReference[oaicite:0]{index=0} is an AI-based emotional support and counseling project that combines conversational AI with chromotherapy and music therapy concepts to create a more immersive and emotionally calming experience.

## Overview

This project focuses on building an AI counselor capable of understanding users’ emotional states and responding in a psychologically supportive manner.  
The AI system is designed not only to provide conversation, but also to dynamically adjust the visual and auditory environment based on the detected mood of the conversation.

The project is currently built on top of Mistral AI models and utilizes custom agent systems for fine-tuning and character building.

---

## Core Features

### AI Counseling System

The counseling AI is designed to communicate naturally with users and provide emotionally supportive conversations.  
To improve response quality and emotional understanding, the model architecture includes additional fine-tuning and personality/character optimization processes.

---

### Dual-AI Architecture

Two separate AI systems are used in this project:

- **Counseling AI**
  - Handles conversations with users
  - Provides emotional support and dialogue

- **Mood Analysis AI**
  - Analyzes temporary chat history
  - Detects emotional tone and overall mood of the conversation
  - Determines the most appropriate visual and musical atmosphere

Temporary chat history is only used during runtime for mood analysis purposes.  
Once the server session ends, all temporary conversation data is deleted.

---

## Chromotherapy Integration

Moodal incorporates the concept of **chromotherapy** by dynamically changing the application's background color depending on the detected emotional atmosphere.

The goal is to create a more emotionally immersive environment that may help users feel calmer and more comfortable during conversations.

Currently available visual modes include:

- Blue Background Mode
- Red Background Mode
- Green Background Mode
- 6 additional background color themes

### Blue Background Mode
<img width="1918" height="1078" src="https://github.com/user-attachments/assets/66b7c829-824b-4214-a6a8-95fadc093a60" />

### Red Background Mode
<img width="1918" height="1078" src="https://github.com/user-attachments/assets/1261f8e4-b17a-4e1e-a87c-ed449374c744" />

### Green Background Mode
<img width="1918" height="1078" src="https://github.com/user-attachments/assets/dafa368c-9ca2-4955-bdfd-241b69f41d2c" />

---

## Music Therapy Integration

The project also applies music therapy concepts by automatically selecting background music that best matches the detected emotional mood.

At the moment, this GitHub version only contains a limited set of music tracks because this repository is an early rebuild of a previous project version.

Additional music genres and adaptive sound systems are planned for future updates.

---

## Privacy

Moodal is designed with privacy in mind.

- User conversations are not permanently stored
- Temporary chat history exists only during runtime
- All temporary data is deleted once the server is closed

The project aims to provide users with a safer and more comfortable environment for emotional expression.

---

## Disclaimer

Moodal is **not** a replacement for professional psychological counseling or medical treatment.

This project is intended to provide lightweight emotional support and create a more approachable first step toward mental wellness and professional help when needed.

---

## Future Plans

- More adaptive music genres
- Improved emotional analysis accuracy
- IoT integration for smart lighting environments
- Better personalization systems
- Enhanced AI memory and contextual understanding
- Mobile support

---
