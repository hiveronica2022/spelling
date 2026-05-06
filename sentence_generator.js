// 错词自动组句生成器

// 句型模板库
const sentenceTemplates = [
    // 基础句型 (Week 1-2)
    {
        pattern: "{subject} {verb} {article} {noun}.",
        translation: "{subject_cn}{verb_cn}{article_cn}{noun_cn}。",
        minWeek: 1,
        example: "I see the cat."
    },
    {
        pattern: "{subject} can {verb} {article} {noun}.",
        translation: "{subject_cn}能{verb_cn}{article_cn}{noun_cn}。",
        minWeek: 1,
        example: "You can make a cake."
    },
    {
        pattern: "{article} {noun} is {adjective}.",
        translation: "{article_cn}{noun_cn}是{adjective_cn}的。",
        minWeek: 1,
        example: "The game is fun."
    },
    {
        pattern: "{subject} {verb} to {place}.",
        translation: "{subject_cn}{verb_cn}到{place_cn}。",
        minWeek: 1,
        example: "We go to the park."
    },
    {
        pattern: "{subject} {verb} {preposition} {article} {noun}.",
        translation: "{subject_cn}{verb_cn}{preposition_cn}{article_cn}{noun_cn}。",
        minWeek: 2,
        example: "He sits on the bike."
    },

    // 进阶句型 (Week 3-4)
    {
        pattern: "{subject} {verb} {article} {adjective} {noun}.",
        translation: "{subject_cn}{verb_cn}{article_cn}{adjective_cn}{noun_cn}。",
        minWeek: 3,
        example: "I see a big tree."
    },
    {
        pattern: "{subject} {verb} {noun1} and {noun2}.",
        translation: "{subject_cn}{verb_cn}{noun1_cn}和{noun2_cn}。",
        minWeek: 3,
        example: "She likes rain and snow."
    },
    {
        pattern: "{subject} will {verb} {preposition} {article} {place}.",
        translation: "{subject_cn}将{verb_cn}{preposition_cn}{article_cn}{place_cn}。",
        minWeek: 3,
        example: "They will meet at the beach."
    },
    {
        pattern: "{subject} {verb_past} {article} {noun} {time}.",
        translation: "{subject_cn}{verb_past_cn}{article_cn}{noun_cn}{time_cn}。",
        minWeek: 4,
        example: "I saw the moon yesterday."
    },

    // 复杂句型 (Week 5+)
    {
        pattern: "{subject} {verb} {article} {noun} but {subject2} {verb2} {article2} {noun2}.",
        translation: "{subject_cn}{verb_cn}{article_cn}{noun_cn}，但{subject2_cn}{verb2_cn}{article2_cn}{noun2_cn}。",
        minWeek: 5,
        example: "I like the book but he likes the game."
    }
];

// 词性分类
const wordTypes = {
    subjects: ['I', 'you', 'he', 'she', 'we', 'they', 'it'],
    subjects_cn: ['我', '你', '他', '她', '我们', '他们', '它'],

    articles: ['a', 'an', 'the'],
    articles_cn: ['一个', '一个', '这个'],

    prepositions: ['in', 'on', 'at', 'to', 'with', 'for'],
    prepositions_cn: ['在...里', '在...上', '在', '到', '和', '为了'],

    verbs: ['see', 'go', 'make', 'take', 'like', 'have', 'get', 'play', 'eat', 'read'],
    verbs_cn: ['看见', '去', '制作', '拿', '喜欢', '有', '得到', '玩', '吃', '读'],

    verbs_past: ['saw', 'went', 'made', 'took', 'came', 'had', 'got', 'ran', 'ate', 'read'],
    verbs_past_cn: ['看见了', '去了', '制作了', '拿了', '来了', '有了', '得到了', '跑了', '吃了', '读了'],

    adjectives: ['good', 'big', 'small', 'new', 'old', 'long', 'short', 'cute', 'cool', 'safe'],
    adjectives_cn: ['好', '大', '小', '新', '旧', '长', '短', '可爱', '酷', '安全'],

    places: ['home', 'park', 'school', 'lake', 'beach', 'cave', 'place'],
    places_cn: ['家', '公园', '学校', '湖', '海滩', '洞穴', '地方'],

    times: ['now', 'today', 'soon', 'then'],
    times_cn: ['现在', '今天', '很快', '然后']
};

// 判断词性
function guessWordType(word, meaning) {
    word = word.toLowerCase();

    // 检查是否在预定义列表中
    if (wordTypes.subjects.includes(word)) return 'subject';
    if (wordTypes.verbs.includes(word)) return 'verb';
    if (wordTypes.verbs_past.includes(word)) return 'verb_past';
    if (wordTypes.adjectives.includes(word)) return 'adjective';
    if (wordTypes.places.includes(word)) return 'place';
    if (wordTypes.prepositions.includes(word)) return 'preposition';

    // 根据中文意思推测
    if (meaning) {
        if (meaning.includes('的')) return 'adjective';
        if (['去', '来', '做', '看', '吃', '玩', '读', '写'].some(v => meaning.includes(v))) return 'verb';
        if (meaning.includes('了')) return 'verb_past';
    }

    // 根据词尾推测
    if (word.endsWith('ed')) return 'verb_past';
    if (word.endsWith('ing')) return 'verb';
    if (word.endsWith('ly')) return 'adverb';

    // 默认为名词
    return 'noun';
}

// 生成句子
function generateSentencesFromErrors(errorWords, currentWeek = 4) {
    if (!errorWords || errorWords.length === 0) {
        return [];
    }

    // 分类错词
    const categorized = {
        nouns: [],
        verbs: [],
        verbs_past: [],
        adjectives: [],
        places: [],
        others: []
    };

    errorWords.forEach(wordObj => {
        const type = guessWordType(wordObj.word, wordObj.meaning);
        if (categorized[type + 's']) {
            categorized[type + 's'].push(wordObj);
        } else if (type === 'noun' || type === 'place') {
            categorized.nouns.push(wordObj);
        } else {
            categorized.others.push(wordObj);
        }
    });

    // 选择合适的模板
    const availableTemplates = sentenceTemplates.filter(t => t.minWeek <= currentWeek);

    // 生成句子
    const sentences = [];
    const usedWords = new Set();

    // 尝试为每个错词生成至少一个句子
    let attempts = 0;
    const maxAttempts = errorWords.length * 3;

    while (usedWords.size < errorWords.length && attempts < maxAttempts) {
        attempts++;

        // 随机选择模板
        const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];

        // 尝试填充模板
        const sentence = fillTemplate(template, errorWords, categorized, usedWords);

        if (sentence) {
            sentences.push(sentence);

            // 标记已使用的词
            sentence.usedErrorWords.forEach(w => usedWords.add(w));
        }

        // 限制句子数量
        if (sentences.length >= Math.min(8, errorWords.length + 2)) {
            break;
        }
    }

    return sentences;
}

// 填充模板
function fillTemplate(template, errorWords, categorized, usedWords) {
    let sentence = template.pattern;
    let translation = template.translation;
    const usedErrorWords = [];

    // 提取模板中的占位符
    const placeholders = sentence.match(/\{[^}]+\}/g) || [];

    for (let placeholder of placeholders) {
        const key = placeholder.slice(1, -1); // 去掉 { }
        let value = '';
        let value_cn = '';
        let isErrorWord = false;

        // 尝试从错词中选择
        if (key === 'noun' || key.startsWith('noun')) {
            const availableNouns = categorized.nouns.filter(w => !usedWords.has(w.word));
            if (availableNouns.length > 0) {
                const selected = availableNouns[Math.floor(Math.random() * availableNouns.length)];
                value = selected.word;
                value_cn = selected.meaning;
                isErrorWord = true;
                usedErrorWords.push(selected.word);
            } else {
                // 使用常见名词
                const commonNouns = ['cat', 'dog', 'book', 'ball', 'car', 'tree', 'bird', 'fish'];
                const commonNouns_cn = ['猫', '狗', '书', '球', '车', '树', '鸟', '鱼'];
                const idx = Math.floor(Math.random() * commonNouns.length);
                value = commonNouns[idx];
                value_cn = commonNouns_cn[idx];
            }
        } else if (key === 'verb' || key.startsWith('verb') && !key.includes('past')) {
            const availableVerbs = categorized.verbs.filter(w => !usedWords.has(w.word));
            if (availableVerbs.length > 0) {
                const selected = availableVerbs[Math.floor(Math.random() * availableVerbs.length)];
                value = selected.word;
                value_cn = selected.meaning;
                isErrorWord = true;
                usedErrorWords.push(selected.word);
            } else {
                const idx = Math.floor(Math.random() * wordTypes.verbs.length);
                value = wordTypes.verbs[idx];
                value_cn = wordTypes.verbs_cn[idx];
            }
        } else if (key.includes('verb_past')) {
            const availableVerbs = categorized.verbs_past.filter(w => !usedWords.has(w.word));
            if (availableVerbs.length > 0) {
                const selected = availableVerbs[Math.floor(Math.random() * availableVerbs.length)];
                value = selected.word;
                value_cn = selected.meaning;
                isErrorWord = true;
                usedErrorWords.push(selected.word);
            } else {
                const idx = Math.floor(Math.random() * wordTypes.verbs_past.length);
                value = wordTypes.verbs_past[idx];
                value_cn = wordTypes.verbs_past_cn[idx];
            }
        } else if (key === 'adjective') {
            const availableAdj = categorized.adjectives.filter(w => !usedWords.has(w.word));
            if (availableAdj.length > 0) {
                const selected = availableAdj[Math.floor(Math.random() * availableAdj.length)];
                value = selected.word;
                value_cn = selected.meaning;
                isErrorWord = true;
                usedErrorWords.push(selected.word);
            } else {
                const idx = Math.floor(Math.random() * wordTypes.adjectives.length);
                value = wordTypes.adjectives[idx];
                value_cn = wordTypes.adjectives_cn[idx];
            }
        } else if (key === 'place') {
            const availablePlaces = categorized.places.filter(w => !usedWords.has(w.word));
            if (availablePlaces.length > 0) {
                const selected = availablePlaces[Math.floor(Math.random() * availablePlaces.length)];
                value = selected.word;
                value_cn = selected.meaning;
                isErrorWord = true;
                usedErrorWords.push(selected.word);
            } else {
                const idx = Math.floor(Math.random() * wordTypes.places.length);
                value = wordTypes.places[idx];
                value_cn = wordTypes.places_cn[idx];
            }
        } else if (key === 'subject' || key.startsWith('subject')) {
            const idx = Math.floor(Math.random() * wordTypes.subjects.length);
            value = wordTypes.subjects[idx];
            value_cn = wordTypes.subjects_cn[idx];
        } else if (key === 'article' || key.startsWith('article')) {
            const idx = Math.floor(Math.random() * wordTypes.articles.length);
            value = wordTypes.articles[idx];
            value_cn = wordTypes.articles_cn[idx];
        } else if (key === 'preposition') {
            const idx = Math.floor(Math.random() * wordTypes.prepositions.length);
            value = wordTypes.prepositions[idx];
            value_cn = wordTypes.prepositions_cn[idx];
        } else if (key === 'time') {
            const idx = Math.floor(Math.random() * wordTypes.times.length);
            value = wordTypes.times[idx];
            value_cn = wordTypes.times_cn[idx];
        }

        // 替换占位符
        sentence = sentence.replace(placeholder, value);
        translation = translation.replace('{' + key + '_cn}', value_cn);
    }

    // 只返回包含至少一个错词的句子
    if (usedErrorWords.length === 0) {
        return null;
    }

    // 首字母大写
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);

    return {
        sentence: sentence,
        translation: translation,
        usedErrorWords: usedErrorWords
    };
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateSentencesFromErrors };
}
