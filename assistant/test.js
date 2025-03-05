// // Modular Command Classifier
//
// // Module for data management
// const CommandDataModule = (function() {
//     let commands = [];
//     let commandLabels = [];
//     let vocabulary = [];
//     let idfValues = {};
//
//     // Initialize with default data
//     function initialize(initialCommands, initialLabels) {
//         commands = initialCommands || [];
//         commandLabels = initialLabels || [];
//         updateVocabulary();
//         calculateTfIdf();
//         return { commands, commandLabels, vocabulary, idfValues };
//     }
//
//     // Add new command examples
//     function addCommands(newCommands) {
//         if (!Array.isArray(newCommands)) {
//             console.error("addCommands expects an array of command objects");
//             return false;
//         }
//
//         // Validate format of new commands
//         const validCommands = newCommands.filter(cmd =>
//             typeof cmd === 'object' &&
//             typeof cmd.text === 'string' &&
//             (typeof cmd.label === 'number' || typeof cmd.labelName === 'string')
//         );
//
//         if (validCommands.length === 0) {
//             console.error("No valid commands found to add");
//             return false;
//         }
//
//         // Process commands with label names instead of indices
//         validCommands.forEach(cmd => {
//             if (typeof cmd.labelName === 'string' && typeof cmd.label !== 'number') {
//                 let labelIndex = commandLabels.indexOf(cmd.labelName);
//                 if (labelIndex === -1) {
//                     // Add new label if it doesn't exist
//                     labelIndex = commandLabels.length;
//                     commandLabels.push(cmd.labelName);
//                     console.log(`Added new label: ${cmd.labelName} with index ${labelIndex}`);
//                 }
//                 cmd.label = labelIndex;
//             }
//         });
//
//         // Add valid commands to our dataset
//         commands = [...commands, ...validCommands];
//
//         // Update vocabulary and TF-IDF values
//         updateVocabulary();
//         calculateTfIdf();
//
//         console.log(`Added ${validCommands.length} new commands. Total commands: ${commands.length}`);
//         return true;
//     }
//
//     // Add a new command label
//     function addCommandLabel(labelName) {
//         if (typeof labelName !== 'string' || labelName.trim() === '') {
//             console.error("Label name must be a non-empty string");
//             return -1;
//         }
//
//         const normalizedLabel = labelName.trim();
//
//         // Check if label already exists
//         const existingIndex = commandLabels.indexOf(normalizedLabel);
//         if (existingIndex !== -1) {
//             console.log(`Label '${normalizedLabel}' already exists with index ${existingIndex}`);
//             return existingIndex;
//         }
//
//         // Add new label
//         const newIndex = commandLabels.length;
//         commandLabels.push(normalizedLabel);
//         console.log(`Added new label: '${normalizedLabel}' with index ${newIndex}`);
//         return newIndex;
//     }
//
//     // Text tokenization with improved preprocessing
//     function tokenizeText(text) {
//         return text.toLowerCase()
//         .replace(/[^a-z ]/g, "")
//         .split(" ")
//         .filter(token => token.length > 0);
//     }
//
//     // Update vocabulary when commands change
//     function updateVocabulary() {
//         vocabulary = [...new Set(commands.flatMap(cmd => tokenizeText(cmd.text)))];
//         console.log("Vocabulary updated. Size:", vocabulary.length);
//     }
//
//     // Calculate TF-IDF values for the vocabulary
//     function calculateTfIdf() {
//         const documentCount = commands.length;
//         const wordDocumentCounts = {};
//
//         // Count documents containing each word
//         vocabulary.forEach(word => {
//             const docsWithWord = commands.filter(cmd =>
//                 tokenizeText(cmd.text).includes(word)
//             ).length;
//             wordDocumentCounts[word] = docsWithWord;
//         });
//
//         // Calculate IDF for each word
//         idfValues = {};
//         vocabulary.forEach(word => {
//             idfValues[word] = Math.log(documentCount / wordDocumentCounts[word]);
//         });
//
//         console.log("TF-IDF values recalculated");
//         return idfValues;
//     }
//
//     // Get current state
//     function getState() {
//         return {
//             commands: [...commands],
//             commandLabels: [...commandLabels],
//             vocabulary: [...vocabulary],
//             idfValues: {...idfValues}
//         };
//     }
//
//     // Return public methods
//     return {
//         initialize,
//         addCommands,
//         addCommandLabel,
//         tokenizeText,
//         updateVocabulary,
//         calculateTfIdf,
//         getState
//     };
// })();
//
// // Module for feature extraction
// const FeatureExtractionModule = (function() {
//     // Basic word stemming
//     function stemWord(word) {
//         const commonSuffixes = ['ing', 'ed', 'es', 's'];
//         let stemmed = word;
//
//         for (const suffix of commonSuffixes) {
//             if (word.endsWith(suffix) && word.length > suffix.length + 2) {
//                 stemmed = word.slice(0, -suffix.length);
//                 break;
//             }
//         }
//
//         return stemmed;
//     }
//
//     // Enhanced tokenization with stemming
//     function tokenizeWithStemming(text, tokenizeFn) {
//         const tokens = tokenizeFn(text);
//         return tokens.map(token => stemWord(token));
//     }
//
//     // TF-IDF encoding
//     function encodeTfIdf(text, vocabulary, idfValues, tokenizeFn) {
//         const words = tokenizeFn(text);
//
//         // Calculate term frequency (TF) in this document
//         const termFrequency = {};
//         words.forEach(word => {
//             termFrequency[word] = (termFrequency[word] || 0) + 1;
//         });
//
//         // For each word in vocabulary, calculate TF-IDF
//         return vocabulary.map(word => {
//             const tf = termFrequency[word] || 0;
//             const idf = idfValues[word] || 0;
//             return tf * idf;
//         });
//     }
//
//     // Enhanced encoding with keyword matching
//     function enhancedEncode(text, vocabulary, idfValues, tokenizeFn, keywordGroups) {
//         // Regular TF-IDF encoding
//         const tfidfFeatures = encodeTfIdf(text, vocabulary, idfValues, tokenizeFn);
//
//         // Get stemmed tokens
//         const tokens = tokenizeWithStemming(text, tokenizeFn);
//
//         // Calculate keyword match scores for each category
//         const keywordScores = keywordGroups.map(group => {
//             const score = group.keywords.reduce((score, keyword) =>
//                 score + (tokens.includes(keyword) ? 1 : 0), 0) / group.keywords.length;
//             return score;
//         });
//
//         // Calculate exact match features
//         const exactMatches = keywordGroups.map(group => {
//             // Check if any of the primary keywords are present
//             const hasPrimaryKeyword = group.primary.some(keyword => tokens.includes(keyword));
//             return hasPrimaryKeyword ? 1 : 0;
//         });
//
//         // Return combined features
//         return [...tfidfFeatures, ...keywordScores, ...exactMatches];
//     }
//
//     // Generate encoder with current settings
//     function createEncoder(dataState, keywordGroups) {
//         return function(text) {
//             return enhancedEncode(
//                 text,
//                 dataState.vocabulary,
//                 dataState.idfValues,
//                 CommandDataModule.tokenizeText,
//                 keywordGroups
//             );
//         };
//     }
//
//     // Return public methods
//     return {
//         stemWord,
//         tokenizeWithStemming,
//         encodeTfIdf,
//         enhancedEncode,
//         createEncoder
//     };
// })();
//
// // Module for model management
// const ModelModule = (function() {
//     let currentModel = null;
//     let encoder = null;
//     let dataState = null;
//     let keywordGroups = [];
//
//     // Initialize model settings
//     function initialize(initialDataState, initialKeywordGroups) {
//         dataState = initialDataState;
//         keywordGroups = initialKeywordGroups;
//         encoder = FeatureExtractionModule.createEncoder(dataState, keywordGroups);
//         return { dataState, keywordGroups };
//     }
//
//     // Train a new model with current data
//     async function trainModel(options = {}) {
//         if (!dataState || !dataState.commands || dataState.commands.length === 0) {
//             console.error("No training data available");
//             return null;
//         }
//
//         const config = {
//             epochs: options.epochs || 200,
//             batchSize: options.batchSize || 8,
//             learningRate: options.learningRate || 0.005,
//             validationSplit: options.validationSplit || 0.15,
//             earlyStoppingPatience: options.earlyStoppingPatience || 15,
//             minDelta: options.minDelta || 0.01,
//             ...options
//         };
//
//         try {
//             console.log("Training model with configuration:", config);
//             console.log(`Training on ${dataState.commands.length} examples with ${dataState.commandLabels.length} labels`);
//
//             // Create feature vectors
//             const features = dataState.commands.map(cmd => encoder(cmd.text));
//             const featureLength = features[0].length;
//             const xs = tf.tensor2d(features);
//
//             // One-hot encode the labels
//             const labels = dataState.commands.map(cmd => {
//                 const oneHot = Array(dataState.commandLabels.length).fill(0);
//                 oneHot[cmd.label] = 1;
//                 return oneHot;
//             });
//             const ys = tf.tensor2d(labels);
//
//             // Create a model with adjustable architecture
//             const model = tf.sequential();
//
//             // Input layer
//             model.add(tf.layers.dense({
//                 units: config.hiddenUnits1 || 32,
//                 activation: "relu",
//                 inputShape: [featureLength],
//                 kernelRegularizer: tf.regularizers.l2({ l2: config.regularization || 0.0005 })
//             }));
//             model.add(tf.layers.dropout({ rate: config.dropoutRate1 || 0.2 }));
//
//             // Hidden layers
//             model.add(tf.layers.dense({
//                 units: config.hiddenUnits2 || 16,
//                 activation: "relu",
//                 kernelRegularizer: tf.regularizers.l2({ l2: config.regularization || 0.0005 })
//             }));
//             model.add(tf.layers.dropout({ rate: config.dropoutRate2 || 0.2 }));
//
//             // Additional hidden layer if specified
//             if (config.useExtraLayer) {
//                 model.add(tf.layers.dense({
//                     units: config.hiddenUnits3 || 8,
//                     activation: "relu",
//                     kernelRegularizer: tf.regularizers.l2({ l2: config.regularization || 0.0005 })
//                 }));
//             }
//
//             // Output layer
//             model.add(tf.layers.dense({
//                 units: dataState.commandLabels.length,
//                 activation: "softmax"
//             }));
//
//             // Use specified optimizer
//             const optimizer = tf.train.adam(config.learningRate);
//
//             model.compile({
//                 optimizer: optimizer,
//                 loss: "categoricalCrossentropy",
//                 metrics: ["accuracy"]
//             });
//
//             // Train with validation split and early stopping
//             const history = await model.fit(xs, ys, {
//                 epochs: config.epochs,
//                 batchSize: config.batchSize,
//                 validationSplit: config.validationSplit,
//                 shuffle: true,
//                 callbacks: [
//                     tf.callbacks.earlyStopping({
//                         monitor: 'val_accuracy',
//                         patience: config.earlyStoppingPatience,
//                         minDelta: config.minDelta,
//                         verbose: 1
//                     })
//                 ]
//             });
//
//             console.log("Training complete!");
//             console.log("Final accuracy:", history.history.acc[history.history.acc.length - 1]);
//
//             // Evaluate model on training data
//             const evaluation = model.evaluate(xs, ys);
//             console.log(`Loss: ${evaluation[0].dataSync()[0].toFixed(4)}, Accuracy: ${evaluation[1].dataSync()[0].toFixed(4)}`);
//
//             // Clean up tensors
//             xs.dispose();
//             ys.dispose();
//
//             // Update current model
//             if (currentModel) {
//                 currentModel.dispose();
//             }
//             currentModel = model;
//
//             return model;
//         } catch (error) {
//             console.error("Error training model:", error);
//             return null;
//         }
//     }
//
//     // Save model to local storage
//     async function saveModel(model, name = 'command-classifier') {
//         try {
//             await model.save(`localstorage://${name}`);
//             console.log(`Model saved to local storage as '${name}'`);
//             return true;
//         } catch (error) {
//             console.error("Error saving model:", error);
//             return false;
//         }
//     }
//
//     // Load model from local storage
//     async function loadModel(name = 'command-classifier') {
//         try {
//             const model = await tf.loadLayersModel(`localstorage://${name}`);
//             console.log(`Model loaded from local storage: '${name}'`);
//             currentModel = model;
//             return model;
//         } catch (error) {
//             console.error(`Error loading model '${name}':`, error);
//             return null;
//         }
//     }
//
//     // Make prediction with keyword fallback
//     async function predictCommand(userInput) {
//         if (!currentModel) {
//             console.error("No model available for prediction");
//             return {
//                 command: null,
//                 confidence: 0,
//                 allProbabilities: {},
//                 matchType: 'no-model-error'
//             };
//         }
//
//         if (!userInput || typeof userInput !== 'string' || userInput.trim() === '') {
//             return {
//                 command: null,
//                 confidence: 0,
//                 allProbabilities: {},
//                 matchType: 'invalid-input'
//             };
//         }
//
//         const userInputLower = userInput.toLowerCase().trim();
//
//         // First check for exact keyword matches
//         for (let i = 0; i < keywordGroups.length; i++) {
//             const group = keywordGroups[i];
//             const exactMatches = group.exact || [];
//
//             if (exactMatches.includes(userInputLower)) {
//                 const result = {
//                     command: dataState.commandLabels[i],
//                     confidence: 0.98,
//                     matchType: 'exact-keyword-match',
//                     allProbabilities: {}
//                 };
//
//                 // Set all probabilities
//                 dataState.commandLabels.forEach((label, idx) => {
//                     result.allProbabilities[label] = idx === i ? 0.98 : 0.02 / (dataState.commandLabels.length - 1);
//                 });
//
//                 return result;
//             }
//         }
//
//         // Check for partial keyword matches
//         for (let i = 0; i < keywordGroups.length; i++) {
//             const group = keywordGroups[i];
//             const partialMatch = group.partial.some(keyword => userInputLower.includes(keyword));
//
//             if (partialMatch) {
//                 const result = {
//                     command: dataState.commandLabels[i],
//                     confidence: 0.85,
//                     matchType: 'partial-keyword-match',
//                     allProbabilities: {}
//                 };
//
//                 // Set all probabilities
//                 dataState.commandLabels.forEach((label, idx) => {
//                     result.allProbabilities[label] = idx === i ? 0.85 : 0.15 / (dataState.commandLabels.length - 1);
//                 });
//
//                 return result;
//             }
//         }
//
//         // Use the model for prediction
//         try {
//             // Encode input
//             const inputEncoded = encoder(userInput);
//             const inputTensor = tf.tensor2d([inputEncoded]);
//
//             // Get prediction
//             const prediction = currentModel.predict(inputTensor);
//             const probabilities = await prediction.data();
//
//             // Get predicted index
//             const predictedIndex = prediction.argMax(1).dataSync()[0];
//             const predictedLabel = dataState.commandLabels[predictedIndex];
//
//             // Get confidence
//             const confidence = probabilities[predictedIndex];
//
//             // Clean up tensors
//             inputTensor.dispose();
//             prediction.dispose();
//
//             // Apply minimum confidence threshold - if below threshold, check keywords
//             if (confidence < 0.5) {
//                 // Fall back to keyword analysis
//                 const tokens = FeatureExtractionModule.tokenizeWithStemming(userInput, CommandDataModule.tokenizeText);
//
//                 // Calculate match scores for each keyword group
//                 const matchScores = keywordGroups.map(group => {
//                     return tokens.filter(token => group.keywords.includes(token)).length;
//                 });
//
//                 const maxScore = Math.max(...matchScores);
//
//                 // If we have keyword matches, override model prediction
//                 if (maxScore > 0) {
//                     const fallbackIndex = matchScores.indexOf(maxScore);
//                     const fallbackConfidence = Math.min(0.7 + (0.1 * maxScore), 0.9);
//
//                     const result = {
//                         command: dataState.commandLabels[fallbackIndex],
//                         confidence: fallbackConfidence,
//                         matchType: 'keyword-fallback',
//                         allProbabilities: {}
//                     };
//
//                     // Set all probabilities
//                     dataState.commandLabels.forEach((label, idx) => {
//                         result.allProbabilities[label] = idx === fallbackIndex ? fallbackConfidence :
//                             (1 - fallbackConfidence) / (dataState.commandLabels.length - 1);
//                     });
//
//                     return result;
//                 }
//             }
//
//             // Return model prediction
//             const result = {
//                 command: predictedLabel,
//                 confidence: confidence,
//                 matchType: 'model-prediction',
//                 allProbabilities: {}
//             };
//
//             // Set all probabilities
//             dataState.commandLabels.forEach((label, idx) => {
//                 result.allProbabilities[label] = probabilities[idx];
//             });
//
//             return result;
//
//         } catch (error) {
//             console.error("Error in prediction:", error);
//
//             // Default fallback
//             const result = {
//                 command: dataState.commandLabels[0],
//                 confidence: 0.60,
//                 matchType: 'error-fallback',
//                 allProbabilities: {}
//             };
//
//             // Set all probabilities
//             dataState.commandLabels.forEach((label, idx) => {
//                 result.allProbabilities[label] = idx === 0 ? 0.60 : 0.40 / (dataState.commandLabels.length - 1);
//             });
//
//             return result;
//         }
//     }
//
//     // Test model with several examples
//     async function testModel(testCases) {
//         if (!currentModel) {
//             console.error("No model available for testing");
//             return [];
//         }
//
//         console.log("Testing model with examples:", testCases);
//         const results = [];
//
//         for (const testInput of testCases) {
//             const result = await predictCommand(testInput);
//             console.log(`Input: "${testInput}" → Predicted: ${result.command} (${(result.confidence * 100).toFixed(2)}%, ${result.matchType})`);
//             results.push({ input: testInput, ...result });
//         }
//
//         return results;
//     }
//
//     // Update keyword groups after adding new command types
//     function updateKeywordGroups(newGroups) {
//         keywordGroups = newGroups;
//         encoder = FeatureExtractionModule.createEncoder(dataState, keywordGroups);
//         console.log("Keyword groups updated:", keywordGroups);
//     }
//
//     // Return public methods
//     return {
//         initialize,
//         trainModel,
//         saveModel,
//         loadModel,
//         predictCommand,
//         testModel,
//         updateKeywordGroups
//     };
// })();
//
// // Module for UI management
// const UIModule = (function() {
//     let predictCallback = null;
//     let addCommandCallback = null;
//     let container = null;
//
//     // Create and attach UI elements
//     function initialize(containerElement, callbacks = {}) {
//         predictCallback = callbacks.predict || (async () => {});
//         addCommandCallback = callbacks.addCommand || (() => {});
//
//         if (!containerElement) {
//             container = document.createElement('div');
//             document.body.appendChild(container);
//         } else {
//             container = containerElement;
//         }
//
//         createMainUI();
//         attachEventListeners();
//
//         return container;
//     }
//
//     // Create the main UI
//     function createMainUI() {
//         container.innerHTML = `
//             <div style="font-family: Arial, sans-serif; color: #fff; background-color: #1a1a1a;
//                         padding: 20px; border-radius: 8px; max-width: 600px; margin: 20px auto;
//                         box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
//
//                 <!-- Prediction Section -->
//                 <div style="margin-bottom: 20px; display: flex;">
//                     <input type="text" id="commandInput" placeholder="Enter a command..."
//                            style="flex: 1; padding: 12px; border: none; border-radius: 4px 0 0 4px;
//                            font-size: 16px; background: #333; color: #fff; outline: none;">
//                     <button id="predictButton"
//                            style="padding: 12px 24px; border: none; border-radius: 0 4px 4px 0;
//                            background: #2c8c76; color: white; font-weight: bold; cursor: pointer;
//                            font-size: 16px; transition: background 0.2s;">Predict</button>
//                 </div>
//
//                 <div id="resultDisplay" style="padding: 15px; background: #2a2a2a; border-radius: 6px;
//                      margin-top: 20px; line-height: 1.6; display: none;"></div>
//
//                 <!-- Examples Section -->
//                 <div id="exampleCommands" style="margin-top: 20px; border-top: 1px solid #444; padding-top: 15px;">
//                     <p style="font-size: 14px; color: #aaa;">Try these commands:</p>
//                     <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;" id="exampleButtons">
//                         <!-- Example buttons will be added here -->
//                     </div>
//                 </div>
//
//                 <!-- Add Command Section -->
//                 <div style="margin-top: 30px; border-top: 1px solid #444; padding-top: 15px;">
//                     <h3 style="color: #fff; font-size: 18px; margin-bottom: 15px;">Add New Command</h3>
//
//                     <div style="display: flex; margin-bottom: 10px;">
//                         <input type="text" id="newCommandText" placeholder="Command text..."
//                                style="flex: 1; padding: 10px; border: none; border-radius: 4px 0 0 4px;
//                                font-size: 14px; background: #333; color: #fff; outline: none;">
//
//                         <select id="newCommandLabel"
//                                 style="padding: 10px; border: none; background: #444; color: #fff;
//                                 font-size: 14px; outline: none;">
//                             <!-- Label options will be added here -->
//                         </select>
//
//                         <button id="addCommandButton"
//                                 style="padding: 10px 16px; border: none; border-radius: 0 4px 4px 0;
//                                 background: #5c6bc0; color: white; font-weight: bold; cursor: pointer;
//                                 font-size: 14px; transition: background 0.2s;">Add</button>
//                     </div>
//
//                     <div style="display: flex; margin-top: 10px;">
//                         <input type="text" id="newLabelInput" placeholder="New label name..."
//                                style="flex: 1; padding: 10px; border: none; border-radius: 4px 0 0 4px;
//                                font-size: 14px; background: #333; color: #fff; outline: none;">
//
//                         <button id="addLabelButton"
//                                 style="padding: 10px 16px; border: none; border-radius: 0 4px 4px 0;
//                                 background: #7e57c2; color: white; font-weight: bold; cursor: pointer;
//                                 font-size: 14px; transition: background 0.2s;">Add Label</button>
//                     </div>
//
//                     <button id="retrainButton"
//                             style="margin-top: 15px; padding: 12px 20px; border: none; border-radius: 4px;
//                             background: #d32f2f; color: white; font-weight: bold; cursor: pointer;
//                             font-size: 14px; width: 100%; transition: background 0.2s;">Retrain Model</button>
//                 </div>
//             </div>
//         `;
//     }
//
//     // Attach event listeners to UI elements
//     function attachEventListeners() {
//         const predictButton = document.getElementById('predictButton');
//         const commandInput = document.getElementById('commandInput');
//         const addCommandButton = document.getElementById('addCommandButton');
//         const addLabelButton = document.getElementById('addLabelButton');
//         const retrainButton = document.getElementById('retrainButton');
//
//         if (predictButton && commandInput) {
//             predictButton.addEventListener('click', async () => {
//                 const userInput = commandInput.value.trim();
//                 if (userInput) {
//                     await handlePrediction(userInput);
//
//                     window.text(userInput);
//                 }
//             });
//
//             commandInput.addEventListener('keypress', async (e) => {
//                 if (e.key === 'Enter') {
//                     const userInput = commandInput.value.trim();
//                     if (userInput) {
//                         await handlePrediction(userInput);
//                     }
//                 }
//             });
//
//             // Button styling
//             predictButton.addEventListener('mouseover', () => {
//                 predictButton.style.background = '#36a18e';
//             });
//
//             predictButton.addEventListener('mouseout', () => {
//                 predictButton.style.background = '#2c8c76';
//             });
//         }
//
//         if (addCommandButton) {
//             addCommandButton.addEventListener('click', handleAddCommand);
//
//             // Button styling
//             addCommandButton.addEventListener('mouseover', () => {
//                 addCommandButton.style.background = '#7986cb';
//             });
//
//             addCommandButton.addEventListener('mouseout', () => {
//                 addCommandButton.style.background = '#5c6bc0';
//             });
//         }
//
//         if (addLabelButton) {
//             addLabelButton.addEventListener('click', handleAddLabel);
//
//             // Button styling
//             addLabelButton.addEventListener('mouseover', () => {
//                 addLabelButton.style.background = '#9575cd';
//             });
//
//             addLabelButton.addEventListener('mouseout', () => {
//                 addLabelButton.style.background = '#7e57c2';
//             });
//         }
//
//         if (retrainButton) {
//             retrainButton.addEventListener('click', handleRetrain);
//
//             // Button styling
//             retrainButton.addEventListener('mouseover', () => {
//                 retrainButton.style.background = '#e53935';
//             });
//
//             retrainButton.addEventListener('mouseout', () => {
//                 retrainButton.style.background = '#d32f2f';
//             });
//         }
//     }
//
//     // Handle prediction request
//     async function handlePrediction(userInput) {
//         const resultDisplay = document.getElementById('resultDisplay');
//
//         if (resultDisplay) {
//             // Show loading state
//             resultDisplay.style.display = 'block';
//             resultDisplay.innerHTML = `
//                 <div style="text-align: center;">
//                     <p>Analyzing command...</p>
//                 </div>
//             `;
//
//             // Call prediction callback
//             setTimeout(async () => {
//                 const result = await predictCallback(userInput);
//                 displayPredictionResult(result);
//             }, 300);
//         }
//     }
//
//     // Display prediction result
//     function displayPredictionResult(result) {
//         const resultDisplay = document.getElementById('resultDisplay');
//
//         if (!resultDisplay || !result || !result.command) {
//             resultDisplay.innerHTML = `
//                 <div style="text-align: center; color: #ff5555;">
//                     <p>Unable to process command</p>
//                 </div>
//             `;
//             return;
//         }
//
//         // Determine confidence color
//         const confidencePercent = (result.confidence * 100);
//         const confidenceColor = getConfidenceColor(confidencePercent);
//
//         // Generate probability bars
//         let probabilityBars = '';
//         Object.entries(result.allProbabilities).forEach(([label, probability]) => {
//             const width = probability * 100;
//             const barColor = getBarColor(label);
//
//             probabilityBars += `
//                 <div style="display: flex; align-items: center; margin-bottom: 5px;">
//                     <span style="width: 80px; font-size: 14px; overflow: hidden; text-overflow: ellipsis;">${label}:</span>
//                     <div style="flex-grow: 1; background: #333; height: 12px; border-radius: 6px; overflow: hidden;">
//                         <div style="background: ${barColor}; width: ${width}%; height: 100%; transition: width 0.5s ease-out;"></div>
//                     </div>
//                     <span style="margin-left: 10px; font-size: 14px; min-width: 45px; text-align: right;">${width.toFixed(1)}%</span>
//                 </div>
//             `;
//         });
//
//         resultDisplay.innerHTML = `
//             <div style="margin-bottom: 20px;">
//                 <p style="font-size: 18px; margin: 0 0 15px 0; font-weight: bold;">Command:
//                     <span style="color: ${confidenceColor};">${result.command}</span>
//                 </p>
//                 <p style="margin: 5px 0;">Confidence:
//                     <span style="font-weight: bold; color: ${confidenceColor};">${confidencePercent.toFixed(1)}%</span>
//                     ${result.matchType ? `<span style="font-size: 12px; color: #aaa; margin-left: 8px;">(${result.matchType})</span>` : ''}
//                 </p>
//             </div>
//
//             <div style="margin-top: 15px;">
//                 <p style="margin: 0 0 10px 0; font-size: 16px;">All Probabilities:</p>
//                 ${probabilityBars}
//             </div>
//         `;
//     }
//
//     // Get color based on confidence
//     function getConfidenceColor(percent) {
//         if (percent >= 85) return '#4CAF50'; // Green
//         if (percent >= 70) return '#8BC34A'; // Light Green
//         if (percent >= 60) return '#CDDC39'; // Lime
//         if (percent >= 50) return '#FFEB3B'; // Yellow
//         if (percent >= 40) return '#FFC107'; // Amber
//         if (percent >= 30) return '#FF9800'; // Orange
//         return '#F44336'; // Red
//     }
//
//     // Get bar color for different commands
//     function getBarColor(label) {
//         // Generate consistent colors based on label
//         const labelHash = label.split('').reduce((hash, char) => {
//             return char.charCodeAt(0) + ((hash << 5) - hash);
//         }, 0);
//
//         // Generate HSL color with good saturation and lightness
//         const hue = Math.abs(labelHash % 360);
//         return `hsl(${hue}, 70%, 60%)`;
//     }
//
//     // Handle adding a new command
//     function handleAddCommand() {
//         const commandText = document.getElementById('newCommandText').value.trim();
//         const labelSelect = document.getElementById('newCommandLabel');
//
//         if (!commandText || !labelSelect) {
//             showNotification('Please enter command text and select a label', 'error');
//             return;
//         }
//
//         const labelValue = labelSelect.value;
//
//         // Call the callback with the new command
//         const result = addCommandCallback({
//             text: commandText,
//             labelName: labelValue
//         });
//
//         if (result) {
//             document.getElementById('newCommandText').value = '';
//             showNotification('Command added successfully!', 'success');
//         } else {
//             showNotification('Failed to add command', 'error');
//         }
//     }
//
//     // Handle adding a new label
//     function handleAddLabel() {
//         const labelInput = document.getElementById('newLabelInput');
//
//         if (!labelInput || labelInput.value.trim() === '') {
//             showNotification('Please enter a label name', 'error');
//             return;
//         }
//
//         // Call the callback to add the label
//         const result = addCommandCallback({ newLabel: labelInput.value.trim() });
//
//         if (result) {
//             labelInput.value = '';
//             updateLabelDropdown();
//             showNotification('Label added successfully!', 'success');
//         } else {
//             showNotification('Failed to add label', 'error');
//         }
//     }
//
//     // Handle model retraining
//     function handleRetrain() {
//         // Show loading notification
//         showNotification('Retraining model...', 'info');
//
//         // Call the callback
//         addCommandCallback({ retrain: true })
//         .then(success => {
//             if (success) {
//                 showNotification('Model retrained successfully!', 'success');
//             } else {
//                 showNotification('Failed to retrain model', 'error');
//             }
//         });
//     }
//
//     // Update the label dropdown with current labels
//     function updateLabelDropdown(labels = []) {
//         const dropdown = document.getElementById('newCommandLabel');
//
//         if (dropdown && labels.length > 0) {
//             dropdown.innerHTML = '';
//
//             labels.forEach(label => {
//                 const option = document.createElement('option');
//                 option.value = label;
//                 option.textContent = label;
//                 dropdown.appendChild(option);
//             });
//         }
//     }
//
//     // Update example buttons
//     function updateExampleButtons(examples = []) {
//         const container = document.getElementById('exampleButtons');
//
//         if (container) {
//             container.innerHTML = '';
//
//             examples.forEach(example => {
//                 const button = document.createElement('button');
//                 button.textContent = example;
//                 button.className = 'example-cmd';
//                 button.dataset.cmd = example;
//                 button.style.cssText = `
//                     padding: 8px 12px;
//                     background: #333;
//                     border: none;
//                     border-radius: 4px;
//                     color: #fff;
//                     cursor: pointer;
//                     font-size: 14px;
//                     transition: background 0.2s;
//                 `;
//
//                 button.addEventListener('mouseover', () => {
//                     button.style.background = '#444';
//                 });
//
//                 button.addEventListener('mouseout', () => {
//                     button.style.background = '#333';
//                 });
//
//                 button.addEventListener('click', () => {
//                     const commandInput = document.getElementById('commandInput');
//                     if (commandInput) {
//                         commandInput.value = example;
//                         document.getElementById('predictButton').click();
//                     }
//                 });
//
//                 container.appendChild(button);
//             });
//         }
//     }
//
//     // Show notification message
//     function showNotification(message, type = 'info') {
//         // Create notification element if it doesn't exist
//         let notification = document.getElementById('notification');
//
//         if (!notification) {
//             notification = document.createElement('div');
//             notification.id = 'notification';
//             notification.style.cssText = `
//                 position: fixed;
//                 bottom: 20px;
//                 right: 20px;
//                 padding: 12px 20px;
//                 border-radius: 4px;
//                 font-family: Arial, sans-serif;
//                 font-size: 14px;
//                 opacity: 0;
//                 transition: opacity 0.3s;
//                 z-index: 1000;
//                 max-width: 300px;
//             `;
//             document.body.appendChild(notification);
//         }
//
//         // Set color based on type
//         const colors = {
//             success: { bg: '#43a047', text: '#fff' },
//             error: { bg: '#e53935', text: '#fff' },
//             info: { bg: '#1e88e5', text: '#fff' },
//             warning: { bg: '#fb8c00', text: '#fff' }
//         };
//
//         const color = colors[type] || colors.info;
//
//         notification.style.backgroundColor = color.bg;
//         notification.style.color = color.text;
//         notification.textContent = message;
//         notification.style.opacity = '1';
//
//         // Hide after 3 seconds
//         setTimeout(() => {
//             notification.style.opacity = '0';
//         }, 3000);
//     }
//
//     // Return public methods
//     return {
//         initialize,
//         updateLabelDropdown,
//         updateExampleButtons,
//         showNotification
//     };
// })();
//
// // Main application controller
// const CommandClassifierApp = (function() {
//     // Default command data
//     const defaultCommands = [
//         // Create commands (label 0)
//         { text: "create blog", label: 0 },
//         { text: "new post", label: 0 },
//         { text: "start blog", label: 0 },
//         { text: "make a post", label: 0 },
//         { text: "add blog", label: 0 },
//         { text: "write post", label: 0 },
//         { text: "publish blog", label: 0 },
//         { text: "create a new blog", label: 0 },
//         { text: "begin blog", label: 0 },
//         { text: "initiate post", label: 0 },
//
//         // Delete commands (label 1)
//         { text: "delete blog", label: 1 },
//         { text: "remove post", label: 1 },
//         { text: "trash blog", label: 1 },
//         { text: "erase post", label: 1 },
//         { text: "get rid of blog", label: 1 },
//         { text: "eliminate post", label: 1 },
//         { text: "delete my blog", label: 1 },
//         { text: "destroy blog", label: 1 },
//         { text: "discard post", label: 1 },
//
//         // Update commands (label 2)
//         { text: "update blog", label: 2 },
//         { text: "edit post", label: 2 },
//         { text: "modify blog", label: 2 },
//         { text: "change post", label: 2 },
//         { text: "revise blog", label: 2 },
//         { text: "alter post", label: 2 },
//         { text: "update my blog post", label: 2 },
//         { text: "update", label: 2 },
//         { text: "edit", label: 2 },
//         { text: "modify", label: 2 },
//         { text: "change", label: 2 },
//         { text: "revise", label: 2 },
//         { text: "refresh blog", label: 2 },
//         { text: "renew post", label: 2 },
//         { text: "amend blog", label: 2 }
//     ];
//
//     const defaultLabels = ["create-blog", "delete-blog", "update-blog"];
//
//     // Default keyword groups for each command category
//     const defaultKeywordGroups = [
//         {
//             // Create
//             keywords: ['create', 'new', 'start', 'make', 'add', 'write', 'publish', 'begin', 'initiate'],
//             primary: ['create', 'new', 'start', 'make'],
//             exact: ['create', 'new', 'add', 'start', 'make', 'write', 'publish'],
//             partial: ['creat', 'new', 'start', 'mak', 'add', 'writ', 'publish']
//         },
//         {
//             // Delete
//             keywords: ['delete', 'remove', 'trash', 'erase', 'rid', 'eliminate', 'destroy', 'discard'],
//             primary: ['delete', 'remove', 'trash'],
//             exact: ['delete', 'remove', 'erase', 'trash', 'destroy', 'discard'],
//             partial: ['delet', 'remov', 'trash', 'eras', 'rid', 'eliminat', 'destroy']
//         },
//         {
//             // Update
//             keywords: ['update', 'edit', 'modify', 'change', 'revise', 'alter', 'amend', 'refresh'],
//             primary: ['update', 'edit', 'modify', 'change'],
//             exact: ['update', 'edit', 'modify', 'change', 'revise', 'alter'],
//             partial: ['updat', 'edit', 'modif', 'chang', 'revis', 'alter', 'amend']
//         }
//     ];
//
//     // Initialize the application
//     async function initialize() {
//         console.log("Initializing Command Classifier App...");
//
//         try {
//             // Check if TensorFlow.js is loaded
//             if (typeof tf === 'undefined') {
//                 console.error("TensorFlow.js is not loaded. Make sure to include the library in your HTML.");
//                 UIModule.showNotification("Error: TensorFlow.js is not loaded.", "error");
//                 return false;
//             }
//
//             // Initialize data module
//             const dataState = CommandDataModule.initialize(defaultCommands, defaultLabels);
//
//             // Initialize model module
//             ModelModule.initialize(dataState, defaultKeywordGroups);
//
//             // Initialize UI module
//             UIModule.initialize(null, {
//                 predict: async (input) => {
//                     return await ModelModule.predictCommand(input);
//                 },
//                 addCommand: async (params) => {
//                     // Handle different types of requests
//                     if (params.retrain) {
//                         return await retrainModel();
//                     } else if (params.newLabel) {
//                         return addNewLabel(params.newLabel);
//                     } else if (params.text) {
//                         return addNewCommand(params);
//                     }
//                     return false;
//                 }
//             });
//
//             // Update UI with current labels
//             UIModule.updateLabelDropdown(dataState.commandLabels);
//
//             // Update example buttons
//             const examples = [
//                 "update blog post",
//                 "create new content",
//                 "delete old post",
//                 "modify this blog",
//                 "add a post"
//             ];
//             UIModule.updateExampleButtons(examples);
//
//             // Try to load existing model or train new one
//             try {
//                 const model = await ModelModule.loadModel();
//                 if (!model) {
//                     throw new Error("No saved model found");
//                 }
//                 UIModule.showNotification("Model loaded successfully", "success");
//             } catch (error) {
//                 console.log("No saved model found, training a new one...", error);
//                 await trainNewModel();
//             }
//
//             return true;
//         } catch (error) {
//             console.error("Error initializing app:", error);
//             UIModule.showNotification("Error initializing application", "error");
//             return false;
//         }
//     }
//
//     // Train a new model
//     async function trainNewModel() {
//         UIModule.showNotification("Training new model...", "info");
//
//         try {
//             const model = await ModelModule.trainModel();
//
//             if (model) {
//                 await ModelModule.saveModel(model);
//                 UIModule.showNotification("Model trained and saved successfully", "success");
//                 return true;
//             } else {
//                 UIModule.showNotification("Failed to train model", "error");
//                 return false;
//             }
//         } catch (error) {
//             console.error("Error training model:", error);
//             UIModule.showNotification("Error training model", "error");
//             return false;
//         }
//     }
//
//     // Retrain the model (e.g., after adding new commands)
//     async function retrainModel() {
//         UIModule.showNotification("Retraining model...", "info");
//
//         try {
//             const model = await ModelModule.trainModel();
//
//             if (model) {
//                 await ModelModule.saveModel(model);
//                 UIModule.showNotification("Model retrained and saved successfully", "success");
//                 return true;
//             } else {
//                 UIModule.showNotification("Failed to retrain model", "error");
//                 return false;
//             }
//         } catch (error) {
//             console.error("Error retraining model:", error);
//             UIModule.showNotification("Error retraining model", "error");
//             return false;
//         }
//     }
//
//     // Add a new command
//     function addNewCommand(commandData) {
//         if (!commandData.text || !commandData.labelName) {
//             return false;
//         }
//
//         try {
//             const result = CommandDataModule.addCommands([
//                 { text: commandData.text, labelName: commandData.labelName }
//             ]);
//
//             return result;
//         } catch (error) {
//             console.error("Error adding command:", error);
//             return false;
//         }
//     }
//
//     // Add a new label
//     function addNewLabel(labelName) {
//         if (!labelName) {
//             return false;
//         }
//
//         try {
//             const newIndex = CommandDataModule.addCommandLabel(labelName);
//
//             if (newIndex >= 0) {
//                 // Get current state
//                 const dataState = CommandDataModule.getState();
//
//                 // Update UI with current labels
//                 UIModule.updateLabelDropdown(dataState.commandLabels);
//
//                 // Create and add a new keyword group for this label
//                 const newKeywordGroup = {
//                     keywords: [],
//                     primary: [],
//                     exact: [],
//                     partial: []
//                 };
//
//                 // Update model's keyword groups
//                 const currentGroups = defaultKeywordGroups.slice();
//                 currentGroups.push(newKeywordGroup);
//                 ModelModule.updateKeywordGroups(currentGroups);
//
//                 return true;
//             }
//
//             return false;
//         } catch (error) {
//             console.error("Error adding label:", error);
//             return false;
//         }
//     }
//
//     // Add multiple example commands for a category
//     function addExampleCommands(labelName, examples) {
//         if (!labelName || !Array.isArray(examples) || examples.length === 0) {
//             return false;
//         }
//
//         try {
//             const commands = examples.map(text => ({ text, labelName }));
//             return CommandDataModule.addCommands(commands);
//         } catch (error) {
//             console.error("Error adding example commands:", error);
//             return false;
//         }
//     }
//
//     // Export the current model state
//     function exportModelState() {
//         try {
//             const dataState = CommandDataModule.getState();
//
//             // Create export object
//             const exportData = {
//                 commands: dataState.commands,
//                 labels: dataState.commandLabels,
//                 timestamp: new Date().toISOString()
//             };
//
//             // Convert to JSON string
//             const jsonString = JSON.stringify(exportData, null, 2);
//
//             // Create download link
//             const blob = new Blob([jsonString], { type: 'application/json' });
//             const url = URL.createObjectURL(blob);
//
//             const a = document.createElement('a');
//             a.href = url;
//             a.download = 'command-classifier-data.json';
//             a.click();
//
//             URL.revokeObjectURL(url);
//
//             return true;
//         } catch (error) {
//             console.error("Error exporting model state:", error);
//             return false;
//         }
//     }
//
//     // Import model state from JSON
//     function importModelState(jsonData) {
//         try {
//             // Parse JSON if string
//             const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
//
//             if (!data.commands || !data.labels) {
//                 console.error("Invalid import data format");
//                 return false;
//             }
//
//             // Initialize with imported data
//             CommandDataModule.initialize(data.commands, data.labels);
//
//             // Update UI
//             const dataState = CommandDataModule.getState();
//             UIModule.updateLabelDropdown(dataState.commandLabels);
//
//             // Update keyword groups
//             const keywordGroups = [];
//
//             dataState.commandLabels.forEach(() => {
//                 keywordGroups.push({
//                     keywords: [],
//                     primary: [],
//                     exact: [],
//                     partial: []
//                 });
//             });
//
//             // Copy default keyword groups where applicable
//             for (let i = 0; i < Math.min(defaultKeywordGroups.length, keywordGroups.length); i++) {
//                 keywordGroups[i] = defaultKeywordGroups[i];
//             }
//
//             ModelModule.updateKeywordGroups(keywordGroups);
//
//             return true;
//         } catch (error) {
//             console.error("Error importing model state:", error);
//             return false;
//         }
//     }
//
//     // Return public methods
//     return {
//         initialize,
//         trainNewModel,
//         retrainModel,
//         addNewCommand,
//         addNewLabel,
//         addExampleCommands,
//         exportModelState,
//         importModelState
//     };
// })();
//
// // Create simple HTML wrapper for the application
// document.addEventListener('DOMContentLoaded', async function() {
//     // Add TensorFlow.js script dynamically if not already present
//     if (typeof tf === 'undefined') {
//         console.log("Adding TensorFlow.js script...");
//         const script = document.createElement('script');
//         script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.18.0/dist/tf.min.js';
//         script.async = true;
//
//         script.onload = () => {
//             console.log("TensorFlow.js loaded successfully");
//             CommandClassifierApp.initialize();
//         };
//
//         script.onerror = () => {
//             console.error("Failed to load TensorFlow.js");
//             alert("Failed to load TensorFlow.js. Please check your internet connection or try again later.");
//         };
//
//         document.head.appendChild(script);
//     } else {
//         // Initialize app directly if TensorFlow is already loaded
//         CommandClassifierApp.initialize();
//     }
// });
//
// // Function for adding multiple commands at once (for testing/demo)
// function addMultipleCommands(commands, retrainAfter = true) {
//     if (!Array.isArray(commands) || commands.length === 0) {
//         console.error("Invalid commands array");
//         return false;
//     }
//
//     try {
//         const result = CommandDataModule.addCommands(commands);
//
//         if (result && retrainAfter) {
//             CommandClassifierApp.retrainModel()
//             .then(success => {
//                 if (success) {
//                     console.log("Model retrained successfully after adding multiple commands");
//                 } else {
//                     console.error("Failed to retrain model after adding multiple commands");
//                 }
//             });
//         }
//
//         return result;
//     } catch (error) {
//         console.error("Error adding multiple commands:", error);
//         return false;
//     }
// }
//
// // Example usage for adding a new command category
// async function addNewCategory(categoryName, exampleCommands, keywords) {
//     // 1. Add the new label
//     const labelAdded = CommandClassifierApp.addNewLabel(categoryName);
//
//     if (!labelAdded) {
//         console.error(`Failed to add new category: ${categoryName}`);
//         return false;
//     }
//
//     // 2. Add example commands
//     const commandsAdded = CommandClassifierApp.addExampleCommands(categoryName, exampleCommands);
//
//     if (!commandsAdded) {
//         console.error(`Failed to add example commands for category: ${categoryName}`);
//     }
//
//     // 3. Get current state
//     const dataState = CommandDataModule.getState();
//     const labelIndex = dataState.commandLabels.indexOf(categoryName);
//
//     if (labelIndex === -1) {
//         console.error(`Label not found: ${categoryName}`);
//         return false;
//     }
//
//     // 4. Update keyword groups
//     const currentGroups = defaultKeywordGroups.slice();
//
//     // Ensure there's a spot for the new category
//     while (currentGroups.length <= labelIndex) {
//         currentGroups.push({
//             keywords: [],
//             primary: [],
//             exact: [],
//             partial: []
//         });
//     }
//
//     // Update with provided keywords
//     if (keywords) {
//         currentGroups[labelIndex] = {
//             keywords: keywords.all || [],
//             primary: keywords.primary || [],
//             exact: keywords.exact || [],
//             partial: keywords.partial || []
//         };
//     }
//
//     ModelModule.updateKeywordGroups(currentGroups);
//
//     // 5. Retrain the model
//     const retrained = await CommandClassifierApp.retrainModel();
//
//     return retrained;
// }