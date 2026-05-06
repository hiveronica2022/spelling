# Week 5-8: 继续混合学习计划

## Week 5: 辅音组合 + 高级Sight Words

### Day 29-35
- **Phonics重点**: ch, sh, th, wh, ph
- **Sight Words**: 30个高级词
- **例词**: chair, ship, think, when, phone
- **句子练习**: 8-10个词的复杂句

---

## Week 6: 混合辅音 + 常用动词

### Day 36-42
- **Phonics重点**: bl, cl, fl, gl, pl, sl, br, cr, dr, fr, gr, pr, tr
- **Sight Words**: 30个常用动词
- **例词**: black, clock, flag, green, play, tree
- **句子练习**: 包含多个动词的句子

---

## Week 7: 结尾辅音组合 + 形容词

### Day 43-49
- **Phonics重点**: -ng, -nk, -ck, -tch, -dge
- **Sight Words**: 30个形容词和副词
- **例词**: sing, think, back, catch, bridge
- **句子练习**: 描述性句子

---

## Week 8: 综合复习 + 高级应用

### Day 50-56
- **Phonics重点**: 所有规则综合应用
- **Sight Words**: 最后30个高频词
- **例词**: 混合所有类型
- **句子练习**: 10-12个词的复杂句子

---

## 总体学习目标

### 8周后掌握
- **Phonics词**: 约200个可拼读词
- **Sight Words**: 约240个高频词
- **总词汇量**: 440个词
- **句子能力**: 能读写10-15个词的句子

### 学习成果
1. **阅读能力**: 能读简单的英文绘本
2. **拼写能力**: 能拼写常用词
3. **造句能力**: 能用学过的词造句
4. **语音意识**: 理解基本的拼读规则

---

## 错词本系统说明

### 自动生成句子规则
1. **收集错词**: 每周自动收集标记的错词
2. **智能组句**: 
   - 每个句子包含2-4个错词
   - 句子长度5-10个词
   - 使用已学过的词填充
   - 句子语法正确，意思合理
3. **复习模式**:
   - 显示中文，填写英文
   - 显示英文，默写全句
   - 听写模式（需家长配合）

### 句子生成算法
```
输入: 本周错词列表 [word1, word2, word3, ...]
输出: 复习句子列表

步骤:
1. 将错词按词性分类（名词、动词、形容词等）
2. 从已学词库中选择连接词（the, a, is, in等）
3. 按照基本句型组合:
   - 主语 + 动词 + 宾语
   - 主语 + be动词 + 形容词
   - There is/are + 名词 + 地点
4. 确保每个错词至少出现1次
5. 句子难度适中，符合当前学习水平
```

### 示例
**本周错词**: rain, train, wait, book, star

**自动生成的句子**:
1. I **wait** for the **train** in the **rain**.
2. Look at the **star** in the **book**.
3. The **train** is here, no need to **wait**.
4. We see a **star** when the **rain** stop.
5. Read the **book** about the **train** and **star**.

---

## 家长使用指南

### 每日学习流程
1. **学习新词** (15分钟)
   - 5个Phonics词: 拼读练习
   - 5个Sight Words: 整体记忆
2. **复习旧词** (10分钟)
   - 快速闪卡
   - 随机抽查
3. **造句练习** (5分钟)
   - 用新词造句
   - 家长纠正
4. **标记错词** (随时)
   - 点击"标记错词"按钮
   - 系统自动收集

### 每周复习流程
1. **周日复习** (30分钟)
   - 认读测试: 60个词
   - 听写测试: 30个词
2. **错词本复习** (15分钟)
   - 查看自动生成的句子
   - 默写练习
   - 听写练习
3. **下周预习** (10分钟)
   - 浏览下周词汇
   - 了解学习重点

### 进度追踪
- **每日**: 查看当天完成情况
- **每周**: 查看周统计和错词本
- **每月**: 查看总体进度和掌握率

---

## 技术实现说明

### 数据结构
```javascript
// 词汇数据
{
  word: "rain",
  type: "phonics", // 或 "sight"
  meaning: "雨",
  phonics: "r-ai-n",
  sound: "/reɪn/",
  week: 3,
  day: 15
}

// 错词记录
{
  word: "rain",
  week: 3,
  day: 15,
  errorCount: 2,
  lastError: "2024-04-20"
}

// 生成的句子
{
  sentence: "I wait for the train in the rain.",
  translation: "我在雨中等火车。",
  words: ["wait", "train", "rain"],
  week: 3
}
```

### 句子生成函数
```javascript
function generateSentences(errorWords, learnedWords) {
  // 1. 分类错词
  const nouns = errorWords.filter(w => w.type === 'noun');
  const verbs = errorWords.filter(w => w.type === 'verb');
  
  // 2. 选择句型模板
  const templates = [
    "{subject} {verb} {object}.",
    "{subject} is {adjective}.",
    "I see {noun} in the {place}."
  ];
  
  // 3. 填充模板
  const sentences = [];
  for (let template of templates) {
    const sentence = fillTemplate(template, errorWords, learnedWords);
    sentences.push(sentence);
  }
  
  return sentences;
}
```

---

## 下一步开发

1. ✅ 创建Week 1-4混合词汇文件
2. ⏳ 创建Week 5-8详细词汇
3. ⏳ 实现错词本自动组句算法
4. ⏳ 更新HTML界面支持新功能
5. ⏳ 添加默写模式
6. ⏳ 添加周复习统计
