'use strict';

globalThis.JournalGrammar = (() => {
  // Each point has a permanent ID and localized name, rule, usage and common errors.
  const groups = [
    {
      name: ['Verb system', '动词系统'],
      points: [
        ['agreement',
          ['Subject–verb agreement', 'The person and number of the subject determine the form of the finite verb.', 'Use “the chart shows”, “the factors contribute” and “the chart does show”. A relative pronoun takes the number of its antecedent.', 'Dropping -s after a singular subject, or using a singular verb with a plural subject.'],
          ['主谓一致', '谓语动词的人称和数由主语决定。关系代词作主语时，看先行词的数。', '写 the chart shows、the factors contribute。句中有 does 时，实义动词用原形：the chart does show。', '第三人称单数漏加 -s，或复数主语误用单数谓语。']],
        ['tense',
          ['Tense and aspect', 'Choose the verb form based on when an action happens and how it relates to the time of speaking.', 'Use the simple past with a finished past time, the present perfect for experience up to now, and will for a future expectation.', 'Switching between past and present without a time change, or using the wrong past or participle form.'],
          ['时态与体', '根据动作发生的时间，以及它与说话时点的关系选用时态。', '已经结束的过去时间用一般过去时；强调截至现在的经历可用现在完成时；对未来的预期可用 will。', '时间未变却切换时态，或把过去式与过去分词混用。']],
        ['voice',
          ['Passive voice', 'Use the passive when the subject receives the action. The form of be carries tense and agreement.', 'Use be + past participle, as in “is held”, “has been held” and “will be held”.', 'Putting a base verb after passive be or omitting be.'],
          ['被动语态', '主语是动作承受者时可用被动语态。be 随时态和主语变化。', '使用 be + 过去分词，如 is held、has been held、will be held。', '在被动结构的 be 后用动词原形，或漏掉 be。']],
        ['nonfinite',
          ['Nonfinite verb forms', 'The construction determines whether a dependent verb is an infinitive, a bare infinitive or a participle.', 'Use “choose to do”, “make someone do”, “be worth doing” and “factors contributing to a trend”.', 'Using “to doing” after choose, adding -ing after causative make, or using a second finite verb as a noun modifier.'],
          ['非谓语与动词补语', '根据句子结构选择带 to 的不定式、动词原形或分词。', '写 choose to do、make someone do、be worth doing；也可以用 factors contributing to a trend 作后置修饰。', 'choose 后误写 to doing，make 使役结构误加 -ing，或用第二个限定动词直接修饰名词。']],
        ['auxiliaries',
          ['Auxiliaries and negation', 'A modal or do auxiliary takes a bare infinitive. Perfect have takes a past participle.', 'Use “can visit”, “may have caused” and “do not have to worry” for lack of obligation.', 'Adding to after a modal, attaching an inflected verb to does, or using “haven’t to” for lack of obligation.'],
          ['助动词与否定', '情态动词和 do 类助动词后接动词原形。完成时的 have 后接过去分词。', '写 can visit、may have caused；表示“不必”可写 do not have to worry。', '情态动词后误加 to，does 后仍用变形的实义动词，或用 haven’t to 表示“不必”。']]
      ]
    },
    {
      name: ['Noun system', '名词系统'],
      points: [
        ['number',
          ['Singular and plural', 'Countable nouns change form when referring to one or several people or things.', 'Use a singular form for one item and a plural after a number greater than one, after many, and often for a whole class.', 'Using a singular noun after many or a plural number, or using the wrong irregular plural.'],
          ['名词单复数', '可数名词根据所指的人或事物的数量变化。', '一项事物用单数。数量大于一、many 后以及泛指一类事物时，通常用复数。', 'many 或大于一的数字后误用单数，或写错 lives 等不规则复数。']],
        ['possessives',
          ['Possessive nouns', 'The apostrophe shows who or what possesses or is associated with something.', 'Write “a student’s book”, “the students’ books” and “people’s brains”.', 'Leaving out the apostrophe or writing a singular possessive for several owners.'],
          ['名词所有格', '用撇号表示所属或关联关系。', '单数名词加 ’s；以 s 结尾的复数只加 ’；不以 s 结尾的复数加 ’s。如 a student’s book、the students’ books、people’s brains。', '漏写撇号，或用单数所有格表示多个所属者。']],
        ['countability',
          ['Countable and uncountable nouns', 'Countable nouns can be counted directly. Uncountable nouns usually take a unit phrase when counted.', 'Use many with plurals, much with uncountable nouns, and phrases like “a piece of news” and “some information”.', 'Using a/an with news, pluralizing information, or mixing up many and much.'],
          ['可数与不可数', '可数名词可以直接数；不可数名词需要计数时，通常要加单位表达。', 'many 接可数复数，much 接不可数名词。可写 a piece of news、some information。', '给 news 直接加 a/an，误写 informations，或混用 many 和 much。']]
      ]
    },
    {
      name: ['Function words', '功能词'],
      points: [
        ['articles',
          ['Articles', 'A/an introduces a singular countable noun. The points to a specific or identifiable referent.', 'Choose a/an by sound, as in “an honor”. General plural and uncountable nouns often take no article.', 'Missing a determiner on a singular countable noun, choosing a/an by spelling, or adding the to a general reference.'],
          ['冠词', 'a/an 用于首次引入或泛指一个可数事物；the 用于特指或双方可识别的对象。', '按读音选 a/an，如 an honor。泛指的复数名词和不可数名词通常不用冠词。', '单数可数名词漏限定词、按字母选 a/an，或泛指时误加 the。']],
        ['prepositions',
          ['Prepositions', 'Prepositions express relationships such as time, place and the complement required by a word.', 'Use “come to a place”, “participate in an event”, “in my spare time” and “this weekend” without a preposition.', 'Omitting a required preposition, substituting a different one, or adding one to a time phrase that needs none.'],
          ['介词', '介词表示时间、地点等关系，也可以由前面的动词、名词或形容词决定。', '写 come to a place、participate in an event、in my spare time；this weekend 前通常不加介词。', '漏掉必需的介词、选错介词，或在不需要介词的时间短语前多加一个。']],
        ['conjunctions',
          ['Conjunctions and coordination', 'Conjunctions link parallel elements or introduce clauses.', 'Use “sports and reading” for two activities, “because + clause” and “because of + noun phrase”.', 'Leaving two items without a conjunction, or putting a full clause immediately after because of.'],
          ['连词与并列', '连词连接并列成分，也可以引导从句。', '两个活动写 sports and reading；because 后接从句，because of 后接名词短语。', '并列项之间漏连词，或在 because of 后直接接完整从句。']],
        ['pronouns',
          ['Pronouns and possessive determiners', 'A pronoun should match its referent and take the form needed by its role.', 'Use “they help us” and “your reply”. Use an object form after a verb or preposition.', 'Using it for a plural referent, or using you where your should modify a noun.'],
          ['代词与物主限定词', '代词要与指代对象一致，并按句中作用使用主格、宾格或物主限定词。', '写 they help us、your reply；动词和介词的宾语用宾格。', '用 it 指代复数事物，或在名词前把 your 写成 you。']]
      ]
    },
    {
      name: ['Sentence structure', '句子结构'],
      points: [
        ['clauses',
          ['Main and subordinate clauses', 'A subordinate clause has a grammatical role in the larger sentence, such as a subject, a complement or a time modifier.', 'Use patterns such as “The fact that … shows …”, “One reason is that …” and “When we meet, I will …”.', 'Joining clauses without a clear relationship, or using a dependent time or condition clause as a sentence by itself.'],
          ['主从句与从句衔接', '从句在完整句子中承担主语、补语或时间、条件等状语功能。', '可用 The fact that … shows …、One reason is that …、When we meet, I will …。', '直接拼接两个从句，或把依赖主句的时间、条件从句单独断成一句。']],
        ['relatives',
          ['Relative clauses', 'A relative clause modifies a noun. The relative word has a role in that clause.', 'Use “the suggestions that you considered”, “students who study online” and “the library where you studied”.', 'Repeating the object represented by that, or confusing a place relative adverb with a relative pronoun.'],
          ['定语从句', '定语从句修饰前面的名词。关系词在从句中承担成分。', '写 the suggestions that you considered、students who study online、the library where you studied。', 'that 已作宾语却再加 it，或在地点作状语时混用 that 和 where。']],
        ['inversion',
          ['Inversion and emphasis', 'Fronted restrictive expressions such as only by or not only can trigger auxiliary–subject inversion in the following clause.', 'Write “Only by practising can we improve” and “Not only can we learn, but we can also apply it”.', 'Keeping normal subject–verb order after a fronted trigger, stacking auxiliaries, or inserting a comma before the inverted main clause.'],
          ['倒装与强调', 'Only by 或 Not only 等限制性成分置首时，紧随其后的主句通常需要部分倒装。', '把助动词放到主语之前，如 Only by practising can we improve；but also 后通常用正常语序。', '置首后仍用正常语序、叠加两个助动词，或在 Only by 短语和倒装主句间误加逗号。']],
        ['completeness',
          ['Sentence and predicate completeness', 'An independent clause usually needs a subject and a finite verb. An imperative can omit its understood subject.', 'Use “you are interested”, “it helps”, “the event will last” or “Book early. I hope …”.', 'Omitting be or a subject where required, or putting be beside a second finite verb in the same predicate.'],
          ['句子与谓语完整性', '独立分句通常需要主语和限定动词。祈使句可省略表示听话人的主语。', '写 you are interested、it helps、the event will last，或将建议与祝愿分开：Book early. I hope …。', '该有主语或 be 时漏写，或把 be 和另一个限定动词叠在同一个谓语里。']]
      ]
    },
    {
      name: ['Vocabulary and collocations', '词汇与搭配'],
      points: [
        ['word-class',
          ['Word classes', 'The role of a word in the sentence determines the part of speech or word form needed.', 'Use “a convenient time”, “work efficiently” and “your preparation”: an adjective before a noun, an adverb for how an action happens, and a noun after a possessive determiner in this pattern.', 'Using a noun where an adjective is needed, or using an adjective to describe how an action is performed.'],
          ['词性辨析', '先看单词在句中承担的作用，再选合适的词性和形式。', '形容词修饰名词，如 a convenient time；副词说明动作方式，如 work efficiently；your preparation 中用名词。', '把名词当形容词用，或用形容词说明动作如何发生。']],
        ['spelling',
          ['Spelling and hyphenation', 'Use established word spellings and conventional hyphenation for compound modifiers.', 'Check forms such as prerequisite and phenomenon. Write “high-quality artwork” when the words form a single modifier before the noun.', 'Transposing or missing letters, or omitting a hyphen in an attributive compound that needs one.'],
          ['拼写与连字符', '按单词的固定拼写和复合修饰语的书写惯例落笔。', '检查 prerequisite、phenomenon 等词。两个词合成一个前置修饰语时，可写 high-quality artwork。', '字母漏写、错序，或漏写前置复合修饰语所需的连字符。']],
        ['capitalization',
          ['Capitalization', 'Capitalize the first word of a sentence and proper names. Ordinary words in running text generally use lowercase.', 'Write China, English, Li Ming and “preferred leisure activities” within a sentence.', 'Leaving a name lowercase or copying title capitalization into ordinary prose.'],
          ['大小写', '句首和专有名词首字母大写。句中的普通词通常小写。', '写 China、English、Li Ming。正文里写 preferred leisure activities。', '姓名、国名漏大写，或在普通句子里照搬标题式大写。']],
        ['collocations',
          ['Fixed expressions and collocations', 'Conventional expressions use specific words together and can require a particular complement pattern.', 'Learn the whole phrase, such as “account for 45%”, “such as”, “a lot of kinds” and “look forward to hearing from you”.', 'Replacing one word with a near synonym, leaving out part of a fixed phrase, or changing the complement form.'],
          ['固定搭配', '固定搭配由习惯上一起出现的词组成，有时还有固定的补语形式。', '整组记 account for 45%、such as、a lot of kinds、look forward to hearing from you。', '换入不适合的近义词、漏掉搭配中的词，或接错补语形式。']],
        ['word-choice',
          ['Word choice', 'Choose a word whose meaning and usage fit what you intend to say.', 'Use “raise productivity” for causing an increase, “prices rise” for increasing, and “too” to add an affirmative point.', 'Confusing similar-looking words, using a verb with the wrong meaning or transitivity, or mixing up affirmative too and negative either.'],
          ['词义选择', '根据要表达的意思和词的句法用法选词。', '提高生产力写 raise productivity；价格上涨写 prices rise；肯定句补充“也”可用 too。', '混用形近词、误判动词的词义或及物性，或混用肯定句的 too 和否定句的 either。']]
      ]
    }
  ];
  const topics = new Map(groups.flatMap(group => group.points.map(([id, en, zh]) =>
    [id, {id, en, zh}]
  )));

  const topicAliases = new Map([...topics.values()].flatMap(({id, en, zh}) =>
    [[id, id], [en[0].toLowerCase(), id], [zh[0], id]]
  ));

  // Resolve compound, legacy or exercise labels against what the annotation actually corrects.
  // Null marks a usage preference or an excerpt without a corresponding draft sentence.
  const archivedTopics = {
    '2026-11-14': {1:'collocations', 3:'word-choice'},
    '2026-11-15': {4:'word-choice', 6:'completeness'},
    '2026-11-16': {1:'clauses', 3:'inversion', 4:'word-choice', 5:null},
    '2026-11-18': {1:'clauses', 2:'nonfinite', 5:'nonfinite', 8:'nonfinite', 9:'tense', 10:'completeness'},
    '2026-11-19': {2:'completeness', 3:'collocations', 5:'countability', 7:'collocations',
      8:'nonfinite', 9:'prepositions', 10:'nonfinite', 11:'inversion', 12:'agreement', 13:'inversion'},
    '2026-11-20': {3:'articles', 6:'agreement', 9:'word-class', 10:'inversion', 12:'spelling'},
    '2026-11-21': {1:'prepositions', 3:'relatives', 4:'clauses', 5:'prepositions', 6:'word-choice',
      7:'collocations', 8:'tense', 10:'capitalization', 11:null, 12:'articles', 13:'agreement'},
    '2026-11-22': {1:'relatives', 3:'clauses', 6:'collocations', 8:'articles', 11:'clauses'},
    '2026-11-23': {7:'nonfinite', 8:'number', 11:'nonfinite', 12:'completeness'},
    '2026-11-24': {8:'spelling', 14:'spelling'},
    '2026-11-25': {14:'countability', 15:null},
    '2026-11-26': {3:'collocations', 7:null, 8:null, 13:'agreement', 17:'relatives', 18:'clauses'}
  };

  const labelPatterns = [
    ['capitalization', /大小写|capitaliz|capitalis/i],
    ['possessives', /所有格|possessive noun|apostrophe/i],
    ['inversion', /倒装|强调句|inversion|fronting/i],
    ['voice', /被动|语态|passive|voice/i],
    ['auxiliaries', /助动词|情态动词|否定|auxiliar|modal|negation/i],
    ['agreement', /主谓一致|第三人称单数|subject.?verb agreement/i],
    ['relatives', /定语从句|关系从句|关系代词|关系副词|relativ[ez]? (clause|pronoun|adverb)/i],
    ['countability', /不可数|可数|countab|mass noun/i],
    ['articles', /冠词|articles?\b/i],
    ['number', /单复数|名词复数|noun (number|plural)|singular and plural/i],
    ['pronouns', /物主限定词|代词|pronoun|possessive determiner/i],
    ['conjunctions', /连词|并列|because 与 because of|conjunction|coordination/i],
    ['completeness', /系动词|谓语结构|谓语完整|祈使句|句子完整|sentence (fragment|completeness)|missing (verb|subject)|predicate/i],
    ['nonfinite', /非谓语|动名词|不定式|现在分词|使役|gerund|infinitive|non.?finite|causative|worth 的用法|want \/|无选择与有选择/i],
    ['clauses', /从句|虚拟语气|句型|句子结构|句子连接|subordinat|conditional|clause|sentence structure/i],
    ['tense', /时态|过去时|过去分词|完成时|tense|past participle/i],
    ['spelling', /拼写|连字符|复合形容词|spelling|hyphen/i],
    ['prepositions', /介词|时间表达|preposition/i],
    ['word-class', /词性|形容词与副词|word class|part of speech/i],
    ['word-choice', /词义|动词辨析|词汇选择|word choice|diction/i],
    ['collocations', /搭配|固定|举例表达|数量表达|look forward to|collocation|fixed (phrase|expression)|idiom/i]
  ];

  function classify(date, g, index) {
    const tag = g[0].trim();
    const why = g[3];
    const archived = archivedTopics[date];
    if (archived && index + 1 in archived) return archived[index + 1];
    if (/原句(?:语法)?(?:本身)?(?:正确|成立|无误)|(?:original|both) (?:sentence|versions?).*grammatically correct/i.test(why)) return null;
    for (const field of [tag, why]) {
      const exact = topicAliases.get(field.trim().toLowerCase());
      if (exact) return exact;
      const match = labelPatterns.find(([, pattern]) => pattern.test(field));
      if (match) return match[0];
    }
    return 'unclassified';
  }

  function summarize(records) {
    const examples = new Map([...topics.keys(), 'unclassified'].map(id => [id, []]));
    const seen = new Set();
    let total = 0;
    for (const date of Object.keys(records).sort().reverse()) {
      const record = records[date];
      (record.grammar || []).forEach((g, index) => {
        const id = classify(date, g, index);
        if (id === null) return;
        // A note sometimes addresses several changes in a sentence. It still has one primary topic.
        // Ignore exact duplicates of its correction within the same entry.
        const key = JSON.stringify([date, g[1].trim(), g[2].trim()]);
        if (seen.has(key)) return;
        seen.add(key);
        examples.get(id).push({date, record, g, index});
        total++;
      });
    }
    const ranked = [...topics.keys()].filter(id => examples.get(id).length)
      .sort((a, b) => examples.get(b).length - examples.get(a).length);
    return {examples, ranked, total};
  }

  const sentenceSegmenter = typeof Intl.Segmenter==='function'
   ? new Intl.Segmenter('en',{granularity:'sentence'}) : null;
  function writingSentences(value) {
   return String(value||'').split(/\r?\n/).flatMap(line=>{
    const text=line.trim();
    if(!text || text==='---')return [];
    if(/^\d+\.\s/.test(text))return [text];
    if(sentenceSegmenter)return Array.from(sentenceSegmenter.segment(text),item=>item.segment.trim());
    return text.split(/(?<=[.!?。！？])\s+/);
   });
  }

  function wordsWithOffsets(text, includePunctuation=false) {
   const pattern=includePunctuation
    ? /[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*|[^\s]/gu
    : /[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu;
   return Array.from(text.matchAll(pattern),match=>({
    text:match[0].replaceAll('’',"'"),start:match.index,end:match.index+match[0].length
   }));
  }

  function locateWords(sentence, phrase, includePunctuation = false) {
   const wanted=wordsWithOffsets(phrase, includePunctuation).map(word=>word.text.toLowerCase());
   if(!wanted.length)return [];
   return sentence.flatMap((word,i)=>wanted.every((text,j)=>sentence[i+j]?.text.toLowerCase()===text)
    ? [sentence.slice(i,i+wanted.length)] : []);
  }

  function changedWordRanges(original, revised, markOmissions=true) {
   // Match words in order so an annotation like "It is a honor to me"
   // strikes only the article. Keep case differences as edits.
   const shared=Array.from({length:original.length+1},()=>new Uint16Array(revised.length+1));
   for(let i=original.length-1;i>=0;i--){
    for(let j=revised.length-1;j>=0;j--){
     shared[i][j]=original[i].text===revised[j].text
      ? 1+shared[i+1][j+1] : Math.max(shared[i+1][j],shared[i][j+1]);
    }
   }
   const anchors=[[-1,-1]];
   let i=0,j=0;
   while(i<original.length && j<revised.length){
    if(original[i].text===revised[j].text)anchors.push([i++,j++]);
    else if(shared[i+1][j]>=shared[i][j+1])i++;
    else j++;
   }
   anchors.push([original.length,revised.length]);
   const ranges=[];
   for(let index=1;index<anchors.length;index++){
    const [left,right]=anchors[index-1], [nextLeft,nextRight]=anchors[index];
    if(nextLeft>left+1){
     ranges.push([original[left+1].start,original[nextLeft-1].end]);
    }else if(markOmissions && original.length && nextRight>right+1){
     // With a missing word, mark the words that surround the omission.
     ranges.push([original[Math.max(0,left)].start,original[Math.min(nextLeft,original.length-1)].end]);
    }
   }
   return ranges;
  }

  const matchKey = text => ' ' + wordsWithOffsets(text).map(word => word.text.toLowerCase()).join(' ') + ' ';
  const noteParts = text => text.split(/\s+\/\s+|\.{3}|…/).filter(part => part.trim());
  // Use archival anchors where the feedback abbreviated or paraphrased the draft,
  // or a short quote matches more than one sentence.
  const archivedContexts = {
    '2026-11-14': {5:[null, 'when we next meet']},
    '2026-11-15': {1:[null, 'I am writing to apologize for not being able to attend'],
      2:[null, 'attend the event as planned / attend an important job interview'],
      3:[null, 'Because the interview is important']},
    '2026-11-16': {3:["Since we can't deny that not only does exercise", "We can't deny that not only does exercise"]},
    '2026-11-18': {3:[null, 'it was worth spending'], 4:[null, 'lower my living standards or sacrifice my comfort'],
      6:[null, 'I was afraid of being punished'], 9:[null, 'my study progress has stalled / studied for a while']},
    '2026-11-21': {4:[null, 'First start with a small task / As the examination approaches you may feel anxious']},
    '2026-11-23': {3:['is the best international city in china / Li ming', 'is the best international city in China / Li Ming']},
    '2026-11-24': {3:[null, 'doing sports and reading account for'], 7:[null, 'as for watching movies / before watching movies']},
    '2026-11-25': {7:[null, "The book-sharing event will be held at 3 o'clock"]},
    '2026-11-26': {3:['counts the highest percentage', 'accounts for the highest percentage']}
  };

  function matchingSentences(sentences, text) {
    const normalized = sentences.map(matchKey);
    const positions = new Set();
    for (const part of noteParts(text)) {
      const key = matchKey(part);
      if (key.trim()) {
        const match = normalized.flatMap((sentence, i) => sentence.includes(key) ? [i] : []);
        if (match.length) {
          match.forEach(i => positions.add(i));
        } else {
          const start = normalized.findIndex((sentence, i) =>
            i + 1 < normalized.length && (sentence + normalized[i + 1].slice(1)).includes(key));
          if (start !== -1) {
            positions.add(start);
            positions.add(start + 1);
          }
        }
      }
    }
    return [...positions].sort((a, b) => a - b);
  }

  function exampleContext({date, record, g, index}) {
    const draft = record.original.flatMap(writingSentences);
    const revision = writingSentences(record.revised);
    const archived = archivedContexts[date]?.[index + 1];
    const original = matchingSentences(draft, archived?.[0] ?? g[1]).map(i => draft[i]).join('\n');
    const revised = matchingSentences(revision, archived?.[1] ?? g[2]).map(i => revision[i]).join('\n');
    return {original, revised};
  }

  const copy = {
    en: {
      title:'Grammar Review', total:'Recorded errors', categories:'Categories with errors',
      frequency:'Error frequency', knowledge:'Grammar topics', rule:'Rule', use:'How to use it',
      mistakes:'Common errors', examples:'My past errors', none:'No recorded errors for this topic.',
      original:'Original', revised:'Revised', noteOriginal:'Excerpt from feedback', noteRevised:'Archived correction',
      because:'Why it was corrected', open:'View full entry ›',
      noSearch:'No topics match your search.', empty:'No recorded errors yet.',
      unclassified:'Unclassified', share:'share of all recorded errors'
    },
    zh: {
      title:'语法统计', total:'累计错误数', categories:'有错误的类别',
      frequency:'各类别错误频率', knowledge:'语法知识分类', rule:'语法规则', use:'正确用法',
      mistakes:'常见错误', examples:'我的历史错句', none:'你还没有这个知识点的错误记录。',
      original:'原句', revised:'修改句', noteOriginal:'批注中的原句片段', noteRevised:'归档订正',
      because:'错误原因', open:'查看当天作文 ›',
      noSearch:'没有找到匹配的知识点。', empty:'还没有归档的语法错误。',
      unclassified:'待归类', share:'占全部错误'
    }
  };

  function element(tag, className, content) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content !== undefined) el.textContent = content;
    return el;
  }

  function appendDiff(el, text, other, from, to, mark) {
    const tokens = wordsWithOffsets(text, true);
    const before = noteParts(from);
    const after = noteParts(to);
    const focused = before.length === after.length ? before.flatMap((part, i) =>
      locateWords(tokens, part, true).flatMap(match =>
        changedWordRanges(match, wordsWithOffsets(after[i], true), false))
    ) : [];
    const ranges = (focused.length ? focused :
      changedWordRanges(tokens, wordsWithOffsets(other, true), false)).sort((a, b) => a[0] - b[0]);
    let offset = 0;
    for (const [start, end] of ranges) {
      if (end <= offset) continue;
      el.append(text.slice(offset, Math.max(offset, start)), element(mark, '', text.slice(Math.max(offset, start), end)));
      offset = end;
    }
    el.append(text.slice(offset));
  }

  function exampleCard(issue, options, t) {
    const card = element('article', 'grammar-review-example');
    const date = element('time', '', issue.date);
    date.dateTime = issue.date;
    const [label, before, after, why] = issue.g;
    const isPhenomenon = issue.date === '2026-11-20' && issue.index === 11;
    const reason = element('div', 'grammar-review-reason');
    reason.append(element('strong', '', t.because), element('p', '', isPhenomenon
      ? (options.locale === 'zh-CN' ? 'phenomnon 漏写了字母 e。正确拼写是 phenomenon。' : 'Phenomnon is missing an e. Write phenomenon.')
      : options.translate(why)));
    const {original, revised} = exampleContext(issue);
    const sentences = element('div', 'grammar-review-sentences');
    const sourceText = original || before;
    const revisedText = isPhenomenon ? original.replace('phenomnon', 'phenomenon') : revised || after;
    const wrong = isPhenomenon ? 'phenomnon' : before;
    const correct = isPhenomenon ? 'phenomenon' : after;
    for (const [title, text, other, from, to, mark] of [
      [original ? t.original : t.noteOriginal, sourceText, revisedText, wrong, correct, 'del'],
      [revised ? t.revised : t.noteRevised, revisedText, sourceText, correct, wrong, 'strong']
    ]) {
      const column = element('div', 'grammar-review-sentence');
      const paragraph = element('p');
      paragraph.lang = 'en';
      appendDiff(paragraph, text, other, from, to, mark);
      column.append(element('span', 'grammar-review-sentence-label', title), paragraph);
      sentences.append(column);
    }
    const link = element('button', 'grammar-review-entry', t.open);
    link.type = 'button';
    link.dataset.grammarEntry = issue.date + ':' + issue.index;
    link.addEventListener('click', () => options.openEntry(issue, link));
    card.append(date, sentences, reason);
    const notes = options.extraNotes?.(issue) || [];
    if (notes.length) {
      const extra = element('details', 'grammar-review-extra');
      extra.append(element('summary', '', options.translate(label)));
      notes.forEach(note => extra.append(element('p', '', options.translate(note))));
      card.append(extra);
    }
    card.append(link);
    return card;
  }

  function render(container, records, options) {
    const {examples, ranked, total} = summarize(records);
    const {locale, query = '', onPoint = () => {}} = options;
    const lang = locale === 'zh-CN' ? 'zh' : 'en';
    const t = copy[lang];
    const unknown = examples.get('unclassified');
    const visible = (id, details = []) => {
      if (!query) return true;
      const key = query.trim().toLowerCase();
      return details.join(' ').toLowerCase().includes(key) || examples.get(id).some(issue =>
        [issue.date, ...issue.g].join(' ').toLowerCase().includes(key));
    };

    const review = element('div', 'grammar-review');
    const title = element('h2', 'grammar-review-title', t.title);
    const metrics = element('dl', 'grammar-review-metrics');
    for (const [label, value] of [[t.total, total], [t.categories, ranked.length]]) {
      const metric = element('div');
      metric.append(element('dt', '', label), element('dd', '', value));
      metrics.append(metric);
    }
    review.append(title, metrics);

    const chart = element('section', 'grammar-review-chart');
    chart.append(element('h3', '', t.frequency));
    const chartList = element('div', 'grammar-review-bars');
    const percentage = new Intl.NumberFormat(locale, {style:'percent', maximumFractionDigits:1});
    const targets = new Map();
    const chartIds = unknown.length ? [...ranked, 'unclassified'] : ranked;
    const max = Math.max(1, ...chartIds.map(id => examples.get(id).length));
    for (const id of chartIds) {
      const point = topics.get(id);
      const name = point ? point[lang][0] : t.unclassified;
      if (!visible(id, point ? [...point.en, ...point.zh] : [name])) continue;
      const count = examples.get(id).length;
      const rate = percentage.format(count / total);
      const button = element('button', 'grammar-review-bar');
      button.type = 'button';
      button.dataset.grammarBar = id;
      button.setAttribute('aria-controls', 'grammar-point-' + id);
      button.setAttribute('aria-label', name + ' · ' + count + ' · ' + rate + ' ' + t.share);
      const track = element('span', 'grammar-review-track');
      track.setAttribute('aria-hidden', 'true');
      track.style.setProperty('--bar', (100 * count / max) + '%');
      button.append(element('span', 'grammar-review-bar-name', name), track,
        element('strong', 'grammar-review-count', count), element('span', 'grammar-review-rate', rate));
      button.addEventListener('click', () => open(id, true));
      chartList.append(button);
    }
    chart.append(chartList.childElementCount ? chartList : element('p', 'grammar-review-muted', total ? t.noSearch : t.empty));
    review.append(chart);

    const knowledge = element('section', 'grammar-review-knowledge');
    knowledge.append(element('h3', '', t.knowledge));
    for (const group of groups) {
      const branch = element('section', 'grammar-review-group');
      const title = element('h4', '', group.name[lang === 'zh' ? 1 : 0]);
      branch.append(title);
      for (const [id, en, zh] of group.points) {
        if (visible(id, [...group.name, ...en, ...zh])) {
          branch.append(topicPanel(id, lang === 'zh' ? zh : en));
        }
      }
      if (branch.childElementCount > 1) knowledge.append(branch);
    }
    if (unknown.length && visible('unclassified', [t.unclassified])) {
      knowledge.append(topicPanel('unclassified', [t.unclassified]));
    }
    if (knowledge.childElementCount === 1) knowledge.append(element('p', 'grammar-review-muted', t.noSearch));
    review.append(knowledge);
    container.replaceChildren(review);

    let active = null;
    if (targets.has(options.openPoint)) open(options.openPoint);
    else if (options.jumpPoint && targets.has(options.jumpPoint)) open(options.jumpPoint, true);
    return {jump: id => { if (targets.has(id)) open(id, true); }};

    function topicPanel(id, [name, rule, use, mistakes]) {
      const point = element('section', 'grammar-review-point');
      point.id = 'grammar-point-' + id;
      const heading = element('h5');
      const button = element('button', 'grammar-review-toggle');
      button.type = 'button';
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', 'grammar-content-' + id);
      const count = examples.get(id).length;
      button.append(element('span', '', name), element('span', 'grammar-review-topic-count', count),
        element('span', 'grammar-review-indicator'));
      button.lastElementChild.setAttribute('aria-hidden', 'true');
      button.addEventListener('click', () => open(active === id ? null : id));
      heading.append(button);
      const panel = element('div', 'grammar-review-panel');
      panel.id = 'grammar-content-' + id;
      panel.inert = true;
      const inner = element('div', 'grammar-review-panel-inner');
      if (rule) {
        const rules = element('dl', 'grammar-review-rules');
        for (const [label, text] of [[t.rule, rule], [t.use, use], [t.mistakes, mistakes]]) {
          rules.append(element('dt', '', label), element('dd', '', text));
        }
        inner.append(rules);
      }
      panel.append(inner);
      point.append(heading, panel);
      targets.set(id, {point, button, panel, inner, loaded:false});
      return point;
    }

    function open(id, jump = false) {
      if (active && active !== id) {
        const previous = targets.get(active);
        previous.point.classList.remove('is-open');
        previous.button.setAttribute('aria-expanded', 'false');
        previous.panel.inert = true;
      }
      active = id;
      onPoint(id);
      if (!id) return;
      const target = targets.get(id);
      if (!target.loaded) {
        const list = examples.get(id);
        if (list.length) {
          target.inner.append(element('h6', 'grammar-review-examples-title', t.examples));
          list.forEach(issue => target.inner.append(exampleCard(issue, options, t)));
        } else {
          target.inner.append(element('p', 'grammar-review-muted', t.none));
        }
        target.loaded = true;
      }
      target.point.classList.add('is-open');
      target.button.setAttribute('aria-expanded', 'true');
      target.panel.inert = false;
      if (jump) {
        target.button.focus({preventScroll:true});
        target.point.scrollIntoView({block:'start', behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
      }
    }
  }

  function label(date, g, index, locale) {
    const point = topics.get(classify(date, g, index));
    return point?.[locale === 'zh-CN' ? 'zh' : 'en'][0] || g[0];
  }

  return {summarize, render, label, writingSentences, wordsWithOffsets, locateWords, changedWordRanges};
})();
