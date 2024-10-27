// app/translation/utils/Trie.ts

class TrieNode {
  children: Record<string, TrieNode> = {};
  isEndOfWord: boolean = false;
  word: string | null = null;
}

export default class Trie {
  root: TrieNode = new TrieNode();

  insert(word: string, originalWord: string) {
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
    node.word = originalWord;
  }

  search(prefix: string): string[] {
    let node = this.root;
    for (let char of prefix) {
      if (!node.children[char]) {
        return [];
      }
      node = node.children[char];
    }
    return this.collectWords(node);
  }

  collectWords(node: TrieNode): string[] {
    let results: string[] = [];
    if (node.isEndOfWord && node.word) {
      results.push(node.word);
    }
    for (let char in node.children) {
      results.push(...this.collectWords(node.children[char]));
    }
    return results;
  }
}
