import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const adjective = fs.readFileSync(path.resolve(__dirname, 'fantasy-words/adjective.txt'), 'utf8');
const adverb = fs.readFileSync(path.resolve(__dirname, 'fantasy-words/adverb.txt'), 'utf8');
const noun = fs.readFileSync(path.resolve(__dirname, 'fantasy-words/noun.txt'), 'utf8');

export const FantasyAdjectives = adjective.split(/,/);
export const FantasyAdverbs = adverb.split(/,/);
export const FantasyNouns = noun.split(/,/);

export const secureRandomNumber = (max: number) => {
  return parseInt(crypto.randomBytes(4).toString('hex'), 16) % max;
};

export const getRandomFantasyWord = (list: string[]): string => {
  return list[secureRandomNumber(list.length)];
};

export const generateFantasyName = (): string => {
  const word = [
    getRandomFantasyWord(FantasyAdverbs),
    getRandomFantasyWord(FantasyAdjectives),
    getRandomFantasyWord(FantasyAdjectives),
    getRandomFantasyWord(FantasyNouns),
  ];
  return word.join('-');
};
