const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

const moderateContent = async (content) => {
const tokenizedContent = tokenizer.tokenize(content);

// Define a list of banned words or patterns
const bannedWords = [
'profanity','offensive','hateful','fuck','shit',
'cunt','pussy','bitch','bastard','asshole',
'idiot','stupid','moron','retard','dumb',
'fuckhead','cock','piss','crap','damn',
'hell','bully','harass','abuse',
];

const isBanned = tokenizedContent.some((word) => bannedWords.includes(word.toLowerCase()));

if (isBanned) {
return { isAllowed: false, content: null };
}

return { isAllowed: true, content };
};

module.exports = moderateContent;