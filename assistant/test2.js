// // Dynamic Property Extractor
// // A completely context-aware, entity-independent property extraction system
//
// class DynamicPropertyExtractor {
//     constructor(options = {}) {
//         this.options = {
//             useWordVectors: true,
//             usePOSTagging: true,
//             useDependencyParsing: true,
//             confidence: 0.7,
//             ...options
//         };
//
//         // Initialize NLP components
//         this.nlp = this._initializeNLP();
//
//         // Cache for models and embeddings
//         this.cache = {
//             wordVectors: null,
//             models: {}
//         };
//     }
//
//     /**
//      * Initialize NLP components based on available libraries
//      * This approach allows for graceful degradation if some NLP libraries aren't available
//      */
//     _initializeNLP() {
//         const nlp = {};
//
//         // Try to load offline NLP libraries if available
//         try {
//             // Check for available NLP libraries
//             if (typeof compromise !== 'undefined') {
//                 nlp.compromise = compromise;
//                 console.log("Initialized with compromise NLP");
//             }
//
//             if (typeof winkNLP !== 'undefined') {
//                 nlp.winkNLP = winkNLP;
//                 nlp.winkNLPModel = winkNLP.readDoc('en');
//                 console.log("Initialized with winkNLP");
//             }
//
//             if (typeof natural !== 'undefined') {
//                 nlp.natural = natural;
//                 console.log("Initialized with natural NLP");
//             }
//
//             if (typeof nlpjs !== 'undefined') {
//                 nlp.nlpjs = nlpjs;
//                 nlp.nlpjsContainer = new nlpjs.Container();
//                 nlp.nlpjsNLP = new nlpjs.Nlp({ container: nlp.nlpjsContainer });
//                 nlp.nlpjsNLP.addLanguage('en');
//                 console.log("Initialized with NLP.js");
//             }
//
//             // Fallback to pure JS implementation if no libraries are available
//             if (Object.keys(nlp).length === 0) {
//                 console.log("No NLP libraries available, using fallback implementation");
//             }
//         } catch (e) {
//             console.warn("Failed to initialize some NLP components:", e);
//         }
//
//         return nlp;
//     }
//
//     /**
//      * Extract properties from text using all available methods
//      * @param {string} text - The input text
//      * @param {Object} context - Optional context to guide extraction
//      * @returns {Object} - Extracted properties
//      */
//     extractProperties(text, context = {}) {
//         // Validate input
//         if (!text || typeof text !== 'string' || text.trim() === '') {
//             return {};
//         }
//
//         // Apply multiple extraction strategies and combine results
//         const results = [
//             // Pattern-based extraction (always available)
//             this._extractPropertiesWithPatterns(text),
//
//             // Context-aware extraction (using specific command context if available)
//             this._extractPropertiesWithContext(text, context),
//
//             // POS-based extraction (if library available)
//             this._extractPropertiesWithPOS(text),
//
//             // Dependency parsing (if library available)
//             this._extractPropertiesWithDependencyParsing(text),
//
//             // Semantic extraction (if vectors available)
//             this._extractPropertiesWithSemantics(text)
//         ];
//
//         // Combine results with confidence scoring
//         return this._combineResults(results);
//     }
//
//     /**
//      * Pattern-based extraction using regex patterns
//      * This method will always be available as a fallback
//      */
//     _extractPropertiesWithPatterns(text) {
//         const properties = {};
//
//         // Normalize text - remove extra spaces, standardize quotes
//         const normalizedText = text
//         .replace(/\s+/g, ' ')
//         .trim();
//
//         // Core patterns for property extraction
//         const patterns = [
//             // From-To pattern (e.g., "from X to Y")
//             {
//                 pattern: /from\s+["']?([^"'\s][^"']*?[^"'\s]?)["']?\s+to\s+["']?([^"'\s][^"']*?[^"'\s]?)["']?/i,
//                 extract: matches => ({ oldName: matches[1], newName: matches[2] })
//             },
//
//             // Named property pattern (e.g., "name: value" or "name = value")
//             {
//                 pattern: /(\w+)\s*[:=]\s*["']?([^"'\s][^"',;]*?[^"'\s,;]?)["']?(?:[,;]|$)/gi,
//                 extract: matches => ({ [matches[1].toLowerCase()]: matches[2] })
//             },
//
//             // Quoted values extraction
//             {
//                 pattern: /["']([^"']+)["']/g,
//                 extract: matches => {
//                     // Store quoted strings as potential name values
//                     if (!properties._quotedStrings) {
//                         properties._quotedStrings = [];
//                     }
//                     properties._quotedStrings.push(matches[1]);
//                     return {};
//                 }
//             },
//
//             // Action on object pattern (e.g., "delete X", "update X")
//             {
//                 pattern: /(delete|remove|update|edit|modify|change)\s+(?:\w+\s+)?["']?([^"'\s][^"']*?[^"'\s]?)["']?/i,
//                 extract: matches => {
//                     const action = matches[1].toLowerCase();
//                     const value = matches[2];
//
//                     // Different property based on action
//                     if (action === 'delete' || action === 'remove') {
//                         return { name: value };
//                     } else {
//                         return { objectName: value };
//                     }
//                 }
//             },
//
//             // Identify identifiers (numbers with context)
//             {
//                 pattern: /(?:id|#|number|identifier)\s*[:=]?\s*["']?(\d+)["']?/i,
//                 extract: matches => ({ id: matches[1] })
//             }
//         ];
//
//         // Apply each pattern
//         for (const { pattern, extract } of patterns) {
//             let matches;
//             // Some patterns need to be executed in a loop (global flag)
//             if (pattern.flags && pattern.flags.includes('g')) {
//                 while ((matches = pattern.exec(normalizedText)) !== null) {
//                     const extracted = extract(matches);
//                     Object.assign(properties, extracted);
//                 }
//             } else {
//                 // Others just need to be executed once
//                 matches = normalizedText.match(pattern);
//                 if (matches) {
//                     const extracted = extract(matches);
//                     Object.assign(properties, extracted);
//                 }
//             }
//         }
//
//         // Post-process: handle quoted strings if no specific properties were found
//         if (properties._quotedStrings && properties._quotedStrings.length > 0) {
//             // If we have exactly 2 quoted strings and no oldName/newName, assume from/to
//             if (properties._quotedStrings.length === 2 && !properties.oldName && !properties.newName) {
//                 properties.oldName = properties._quotedStrings[0];
//                 properties.newName = properties._quotedStrings[1];
//             }
//             // If we have 1 quoted string and no name, assume it's the name
//             else if (properties._quotedStrings.length === 1 && !properties.name) {
//                 properties.name = properties._quotedStrings[0];
//             }
//
//             // Remove the temporary storage
//             delete properties._quotedStrings;
//         }
//
//         return {
//             properties,
//             confidence: 0.8, // Base confidence for pattern matching
//             method: 'pattern'
//         };
//     }
//
//     /**
//      * Context-aware extraction
//      * Uses the command context to guide property extraction
//      */
//     _extractPropertiesWithContext(text, context) {
//         // If no specific context provided, return empty
//         if (!context.command) {
//             return { properties: {}, confidence: 0, method: 'context' };
//         }
//
//         const properties = {};
//         let confidence = 0.5; // Start with medium confidence
//
//         // Define expected properties based on command
//         const commandPatterns = {
//             'create': {
//                 expectedProps: ['name', 'title', 'type', 'category'],
//                 patterns: [
//                     // Create with name pattern
//                     {
//                         pattern: /(?:create|add|new)\s+(?:\w+\s+)?(?:called|named|titled|with name)\s+["']?([^"'\s][^"']*?[^"'\s]?)["']?/i,
//                         extract: matches => ({ name: matches[1] }),
//                         boost: 0.2
//                     },
//                     // Create with properties pattern
//                     {
//                         pattern: /(?:create|add|new)\s+(?:\w+\s+)?with\s+(.+)/i,
//                         extract: matches => {
//                             // Parse property list from "with" clause
//                             const withClause = matches[1];
//                             const props = {};
//                             const propMatches = withClause.matchAll(/(\w+)\s*[:=]\s*["']?([^"'\s][^"',;]*?[^"'\s,;]?)["']?/gi);
//                             for (const propMatch of propMatches) {
//                                 props[propMatch[1].toLowerCase()] = propMatch[2];
//                             }
//                             return props;
//                         },
//                         boost: 0.2
//                     }
//                 ]
//             },
//             'update': {
//                 expectedProps: ['oldName', 'newName', 'id', 'changes'],
//                 patterns: [
//                     // Update with from/to pattern
//                     {
//                         pattern: /(?:update|change|modify|edit|rename)\s+(?:\w+\s+)?from\s+["']?([^"'\s][^"']*?[^"'\s]?)["']?\s+to\s+["']?([^"'\s][^"']*?[^"'\s]?)["']?/i,
//                         extract: matches => ({ oldName: matches[1], newName: matches[2] }),
//                         boost: 0.3
//                     },
//                     // Update specific property pattern
//                     {
//                         pattern: /(?:update|change|modify|edit|set)\s+(?:\w+\s+)?(?:with\s+)?(\w+)\s+(?:to|as|with)\s+["']?([^"'\s][^"']*?[^"'\s]?)["']?/i,
//                         extract: matches => ({ [matches[1].toLowerCase()]: matches[2] }),
//                         boost: 0.2
//                     }
//                 ]
//             },
//             'delete': {
//                 expectedProps: ['name', 'id', 'confirmation'],
//                 patterns: [
//                     // Delete by name pattern
//                     {
//                         pattern: /(?:delete|remove)\s+(?:\w+\s+)?(?:named|called|titled)\s+["']?([^"'\s][^"']*?[^"'\s]?)["']?/i,
//                         extract: matches => ({ name: matches[1] }),
//                         boost: 0.3
//                     },
//                     // Delete by id pattern
//                     {
//                         pattern: /(?:delete|remove)\s+(?:\w+\s+)?(?:with\s+)?(?:id|#)\s*[:=]?\s*["']?(\d+)["']?/i,
//                         extract: matches => ({ id: matches[1] }),
//                         boost: 0.3
//                     },
//                     // Direct delete pattern
//                     {
//                         pattern: /(?:delete|remove)\s+["']?([^"'\s][^"']*?[^"'\s]?)["']?/i,
//                         extract: matches => ({ name: matches[1] }),
//                         boost: 0.2
//                     }
//                 ]
//             }
//         };
//
//         // Map command to pattern group
//         let patternGroup = null;
//
//         // Match command to pattern groups
//         for (const [key, group] of Object.entries(commandPatterns)) {
//             if (context.command.toLowerCase().includes(key)) {
//                 patternGroup = group;
//                 confidence += 0.1; // Boost confidence when we match a command
//                 break;
//             }
//         }
//
//         // If no matching pattern group, return empty
//         if (!patternGroup) {
//             return { properties: {}, confidence: 0.3, method: 'context' };
//         }
//
//         // Apply command-specific patterns
//         for (const { pattern, extract, boost } of patternGroup.patterns) {
//             const matches = text.match(pattern);
//             if (matches) {
//                 const extracted = extract(matches);
//                 Object.assign(properties, extracted);
//                 confidence += boost || 0; // Boost confidence based on matched pattern
//             }
//         }
//
//         return {
//             properties,
//             confidence: Math.min(confidence, 1.0), // Cap at 1.0
//             method: 'context'
//         };
//     }
//
//     /**
//      * POS-based extraction using Part-of-Speech tagging
//      * Requires a compatible NLP library
//      */
//     _extractPropertiesWithPOS(text) {
//         const properties = {};
//         let confidence = 0.5;
//
//         // Check if we have a compatible NLP library
//         if (!this.options.usePOSTagging) {
//             return { properties, confidence: 0, method: 'pos' };
//         }
//
//         try {
//             let tags = [];
//
//             // Try to use available libraries for POS tagging
//             if (this.nlp.compromise) {
//                 const doc = this.nlp.compromise(text);
//
//                 // Extract proper nouns - likely to be entity names
//                 const properNouns = doc.match('#ProperNoun+').out('array');
//                 if (properNouns.length > 0) {
//                     properties.entities = properNouns;
//                     confidence += 0.1;
//                 }
//
//                 // Extract quoted text
//                 const quoted = doc.quotations().out('array');
//                 if (quoted.length === 1) {
//                     properties.name = quoted[0].replace(/['"]/g, '');
//                     confidence += 0.2;
//                 } else if (quoted.length === 2) {
//                     properties.oldName = quoted[0].replace(/['"]/g, '');
//                     properties.newName = quoted[1].replace(/['"]/g, '');
//                     confidence += 0.3;
//                 }
//
//                 // Extract verbs - likely to indicate actions
//                 const verbs = doc.verbs().out('array');
//                 if (verbs.length > 0) {
//                     const mainVerb = verbs[0].toLowerCase();
//                     properties.action = mainVerb;
//                     confidence += 0.1;
//
//                     // Look for objects of the verb
//                     if (mainVerb === 'delete' || mainVerb === 'remove') {
//                         const objects = doc.match(mainVerb + ' [.]').out('array');
//                         if (objects.length > 0) {
//                             const objectName = objects[0].replace(mainVerb, '').trim();
//                             if (objectName && !properties.name) {
//                                 properties.name = objectName;
//                                 confidence += 0.1;
//                             }
//                         }
//                     }
//                 }
//             }
//             // Add other NLP libraries here if available
//             else if (this.nlp.winkNLP) {
//                 // Implement winkNLP-based extraction
//             }
//             else if (this.nlp.natural) {
//                 // Implement natural-based extraction
//             }
//             else {
//                 // No compatible library found
//                 return { properties, confidence: 0, method: 'pos' };
//             }
//         } catch (e) {
//             console.warn("Error in POS-based extraction:", e);
//             return { properties, confidence: 0, method: 'pos' };
//         }
//
//         return {
//             properties,
//             confidence: Math.min(confidence, 1.0),
//             method: 'pos'
//         };
//     }
//
//     /**
//      * Extraction using dependency parsing
//      * Requires a compatible NLP library with dependency parsing
//      */
//     _extractPropertiesWithDependencyParsing(text) {
//         // This is a placeholder for dependency parsing
//         // Would need a more advanced NLP library like spaCy.js
//         return {
//             properties: {},
//             confidence: 0,
//             method: 'dependency'
//         };
//     }
//
//     /**
//      * Semantic extraction using word vectors
//      * Requires pre-trained word embeddings
//      */
//     _extractPropertiesWithSemantics(text) {
//         // This is a placeholder for semantic extraction
//         // Would need word embeddings like Word2Vec or GloVe
//         return {
//             properties: {},
//             confidence: 0,
//             method: 'semantic'
//         };
//     }
//
//     /**
//      * Combine results from different extraction methods
//      * Uses confidence scores to resolve conflicts
//      */
//     _combineResults(results) {
//         const combined = {};
//         const sources = {};
//         const confidences = {};
//
//         // Process each result
//         for (const result of results) {
//             const { properties, confidence, method } = result;
//
//             // Skip empty results or those with zero confidence
//             if (!properties || confidence <= 0) continue;
//
//             // For each property in the result
//             for (const [key, value] of Object.entries(properties)) {
//                 // If property doesn't exist or has higher confidence, use this one
//                 if (!combined[key] || confidences[key] < confidence) {
//                     combined[key] = value;
//                     sources[key] = method;
//                     confidences[key] = confidence;
//                 }
//             }
//         }
//
//         // Calculate overall confidence
//         let overallConfidence = 0;
//         const confidenceSum = Object.values(confidences).reduce((sum, val) => sum + val, 0);
//         const confidenceCount = Object.values(confidences).length || 1;
//         overallConfidence = confidenceSum / confidenceCount;
//
//         return combined;
//     }
//
//     /**
//      * Process a command to determine both intent and properties
//      * @param {string} text - User input text
//      * @param {Object} options - Processing options
//      * @returns {Object} - Command intent and properties
//      */
//     async processCommand(text, options = {}) {
//         // First, try to determine the command intent using the classifier
//         let commandResult = { command: null, confidence: 0 };
//
//         if (options.classifier) {
//             try {
//                 commandResult = await options.classifier.predictCommand(text);
//             } catch (e) {
//                 console.warn("Error predicting command:", e);
//                 // Try to infer command from text
//                 commandResult = this._inferCommand(text);
//             }
//         } else {
//             // No classifier available, infer command
//             commandResult = this._inferCommand(text);
//         }
//
//         // Extract properties using the command as context
//         const properties = this.extractProperties(text, { command: commandResult.command });
//
//         return {
//             command: commandResult.command,
//             confidence: commandResult.confidence,
//             properties: properties,
//             input: text
//         };
//     }
//
//     /**
//      * Infer command from text without a classifier
//      * Simple rule-based approach
//      */
//     _inferCommand(text) {
//         const lowerText = text.toLowerCase();
//
//         // Simple rules to infer command
//         if (lowerText.match(/^(create|add|new|make)/)) {
//             return { command: 'create', confidence: 0.8 };
//         }
//         if (lowerText.match(/^(update|edit|modify|change|rename)/)) {
//             return { command: 'update', confidence: 0.8 };
//         }
//         if (lowerText.match(/^(delete|remove|destroy)/)) {
//             return { command: 'delete', confidence: 0.8 };
//         }
//
//         // Default to unknown with low confidence
//         return { command: 'unknown', confidence: 0.3 };
//     }
// }
//
// // Simpler fallback implementation for environments without NLP libraries
// class SimplePropertyExtractor {
//     constructor(options = {}) {
//         this.options = {
//             confidence: 0.7,
//             ...options
//         };
//     }
//
//     extractProperties(text) {
//         const properties = {};
//
//         // Basic patterns for property extraction
//         const patterns = [
//             // From-To pattern
//             {
//                 pattern: /from\s+["']?([^"'\s][^"']*?[^"'\s]?)["']?\s+to\s+["']?([^"'\s][^"']*?[^"'\s]?)["']?/i,
//                 extract: matches => ({ oldName: matches[1], newName: matches[2] })
//             },
//             // Named entities
//             {
//                 pattern: /named\s+["']?([^"'\s][^"']*?[^"'\s]?)["']?/i,
//                 extract: matches => ({ name: matches[1] })
//             },
//             {
//                 pattern: /called\s+["']?([^"'\s][^"']*?[^"'\s]?)["']?/i,
//                 extract: matches => ({ name: matches[1] })
//             },
//             // Property assignments
//             {
//                 pattern: /(\w+)\s*[:=]\s*["']?([^"'\s][^"',;]*?[^"'\s,;]?)["']?/gi,
//                 extract: matches => ({ [matches[1].toLowerCase()]: matches[2] })
//             },
//             // Quoted strings
//             {
//                 pattern: /["']([^"']+)["']/g,
//                 extract: matches => {
//                     if (!properties._quotedStrings) {
//                         properties._quotedStrings = [];
//                     }
//                     properties._quotedStrings.push(matches[1]);
//                     return {};
//                 }
//             }
//         ];
//
//         // Apply patterns
//         for (const { pattern, extract } of patterns) {
//             let matches;
//             if (pattern.flags && pattern.flags.includes('g')) {
//                 while ((matches = pattern.exec(text)) !== null) {
//                     const extracted = extract(matches);
//                     Object.assign(properties, extracted);
//                 }
//             } else {
//                 matches = text.match(pattern);
//                 if (matches) {
//                     const extracted = extract(matches);
//                     Object.assign(properties, extracted);
//                 }
//             }
//         }
//
//         // Post-process quoted strings
//         if (properties._quotedStrings && properties._quotedStrings.length > 0) {
//             if (properties._quotedStrings.length === 2 && !properties.oldName && !properties.newName) {
//                 properties.oldName = properties._quotedStrings[0];
//                 properties.newName = properties._quotedStrings[1];
//             } else if (properties._quotedStrings.length === 1 && !properties.name) {
//                 properties.name = properties._quotedStrings[0];
//             }
//             delete properties._quotedStrings;
//         }
//
//         return properties;
//     }
//
//     async processCommand(text) {
//         // Simple command inference
//         let command = 'unknown';
//         let confidence = 0.5;
//
//         const lowerText = text.toLowerCase();
//         if (lowerText.match(/^(create|add|new|make)/)) {
//             command = 'create';
//             confidence = 0.8;
//         } else if (lowerText.match(/^(update|edit|modify|change|rename)/)) {
//             command = 'update';
//             confidence = 0.8;
//         } else if (lowerText.match(/^(delete|remove|destroy)/)) {
//             command = 'delete';
//             confidence = 0.8;
//         }
//
//         // Extract properties
//         const properties = this.extractProperties(text);
//
//         return {
//             command,
//             confidence,
//             properties,
//             input: text
//         };
//     }
// }
//
// // Usage example
// window.text = async function(text)
// {
//     // Check environment capabilities and create appropriate extractor
//     let extractor;
//     try {
//         // Try to create advanced extractor
//         extractor = new DynamicPropertyExtractor();
//         console.log("Using DynamicPropertyExtractor");
//     } catch (e) {
//         // Fall back to simple extractor
//         console.warn("Falling back to SimplePropertyExtractor:", e);
//         extractor = new SimplePropertyExtractor();
//     }
//
//     // Process the command
//     const result = await extractor.processCommand(text);
//
//     console.log(`Detected command: ${result.command} (${(result.confidence * 100).toFixed(1)}% confidence)`);
//     console.log("Extracted properties:", result.properties);
// }
