const policySelect = document.getElementById('policySelect');
const docSelect = document.getElementById('docSelect');
const policyTextarea = document.getElementById('policyTextarea');
const docsTextarea = document.getElementById('docsTextarea');
const policyFileInput = document.getElementById('policyFileInput');
const docFileInput = document.getElementById('docFileInput');
const loadSampleButton = document.getElementById('loadSampleButton');
const runButton = document.getElementById('runButton');
const exportButton = document.getElementById('exportButton');
const inputHint = document.getElementById('inputHint');
const pipelineStatus = document.getElementById('pipelineStatus');
const clauseGraph = document.getElementById('clauseGraph');
const conflictList = document.getElementById('conflictList');
const riskMatrix = document.getElementById('riskMatrix');
const reasoningList = document.getElementById('reasoningList');
const remediationList = document.getElementById('remediationList');
const statClauses = document.getElementById('statClauses');
const statConflicts = document.getElementById('statConflicts');
const statHigh = document.getElementById('statHigh');
const statConfidence = document.getElementById('statConfidence');
const summaryNarrative = document.getElementById('summaryNarrative');
const clauseCountBadge = document.getElementById('clauseCountBadge');
const conflictCountBadge = document.getElementById('conflictCountBadge');

const agents = {
  A: {
    card: document.getElementById('agentCardA'),
    state: document.getElementById('agentStateA'),
    summary: document.getElementById('agentSummaryA')
  },
  B: {
    card: document.getElementById('agentCardB'),
    state: document.getElementById('agentStateB'),
    summary: document.getElementById('agentSummaryB')
  },
  C: {
    card: document.getElementById('agentCardC'),
    state: document.getElementById('agentStateC'),
    summary: document.getElementById('agentSummaryC')
  },
  D: {
    card: document.getElementById('agentCardD'),
    state: document.getElementById('agentStateD'),
    summary: document.getElementById('agentSummaryD')
  }
};

const defaultPolicies = [
  {
    id: 'policy-cn-aml-001',
    title: '金融机构客户身份识别与交易留痕管理要求（示例）',
    issuer: '示例监管机构',
    publishedAt: '2026-04-15',
    summary: '针对客户实名制、可疑交易监测、留痕时限与重大事件报告提出更严格要求。',
    text: '第一条 金融机构应当对客户身份进行真实、完整、持续识别，不得为匿名客户或者身份不明客户开立账户。第二条 金融机构必须建立异常交易监测机制，对高频、大额、跨境、短期集中交易进行识别与复核，并形成留痕。第三条 涉及客户核心身份资料、交易记录、风控决策依据的电子信息，保存期限不得少于五年。第四条 对涉嫌洗钱、欺诈、利益输送或者重大声誉风险的情形，机构应当在发现后24小时内完成内部升级报告，并按要求向监管部门报送。第五条 对外披露、营销文案、产品协议不得以模糊表述替代关键风险揭示，不得弱化用户适当性义务与费用说明。'
  },
  {
    id: 'policy-cn-data-002',
    title: '重要业务数据治理与可审计性指引（示例）',
    issuer: '示例监管机构',
    publishedAt: '2026-03-02',
    summary: '强调关键数据可追溯、审批留痕、客户授权证明、审计日志完整性。',
    text: '第一条 机构处理客户授权、风险评级、授信审批、费率调整等关键业务数据时，必须保证可追溯、可还原、可审计。第二条 涉及客户授权或适当性判断的重要字段，不得仅保留最终结果，应当同步保存原始输入、判断依据与操作时间。第三条 任何删除、覆盖、批量修改关键业务数据的操作，必须保留操作人、审批链与执行日志。第四条 当内部制度与监管要求存在不一致时，应当从严适用监管要求，并及时修订存量制度与对客文本。'
  }
];

const defaultDocs = [
  {
    id: 'doc-contract-001',
    category: '客户协议',
    title: '线上极速开户服务协议（示例）',
    owner: '零售金融事业部',
    text: '为提升开户效率，平台可在客户暂未补全实名资料的情况下先行开立体验账户，客户后续补交信息即可继续使用。平台对异常交易进行抽样复核，无需对所有高风险交易留存详细分析记录。若系统存储空间不足，交易记录通常保留12个月。对于可能产生声誉影响的事件，由业务部门在必要时择机上报。'
  },
  {
    id: 'doc-product-002',
    category: '产品条款',
    title: '财富管理产品说明书（示例）',
    owner: '财富管理中心',
    text: '本产品致力于提供稳健收益，历史表现仅供参考。风险揭示部分可由平台统一摘要展示，详细费用说明与适当性判断可在客户提出要求时另行提供。营销材料允许使用收益增强、低波动等概括性措辞。'
  },
  {
    id: 'doc-policy-003',
    category: '内部制度',
    title: '客户数据操作规范（示例）',
    owner: '运营管理部',
    text: '客户授权状态、适当性评分与费率信息以最终结果为准，系统无需长期保存中间判断依据。批量修正关键字段后，仅保留汇总变更记录即可。若内部制度与外部规范出现差异，可优先按照现行内部流程执行，后续统一评估调整。'
  }
];

const severityKeywords = {
  critical: ['不得', '必须', '24小时', '监管部门', '匿名', '身份不明', '处罚', '报送'],
  high: ['应当', '留痕', '披露', '适当性', '保存期限', '可审计', '审批链', '删除', '覆盖'],
  medium: ['风险', '授权', '监测', '复核', '日志', '修订', '营销文案']
};

const conflictRules = [
  {
    id: 'identity-gap',
    clauseKeywords: ['不得', '匿名', '身份不明', '识别'],
    docKeywords: ['体验账户', '补交信息', '暂未补全实名'],
    label: '实名识别缺口',
    impact: '开户流程与客户准入控制',
    riskDrivers: ['客户身份识别缺失', '可能触发监管处罚']
  },
  {
    id: 'monitoring-gap',
    clauseKeywords: ['异常交易', '识别', '复核', '留痕'],
    docKeywords: ['抽样复核', '无需', '高风险交易'],
    label: '异常交易监测不足',
    impact: '交易监测与反洗钱风控',
    riskDrivers: ['高风险交易留痕不足', '监测闭环不完整']
  },
  {
    id: 'retention-gap',
    clauseKeywords: ['保存期限', '五年', '记录'],
    docKeywords: ['12个月', '存储空间不足', '通常保留'],
    label: '留痕保存期限不足',
    impact: '审计留痕与举证能力',
    riskDrivers: ['关键记录保存时长不达标', '审计与追责能力下降']
  },
  {
    id: 'reporting-gap',
    clauseKeywords: ['24小时', '报告', '报送', '重大声誉风险'],
    docKeywords: ['择机上报', '必要时', '业务部门'],
    label: '重大事件上报时限不明确',
    impact: '重大事件升级与监管沟通',
    riskDrivers: ['报告时限不达标', '重大事件可能迟报漏报']
  },
  {
    id: 'disclosure-gap',
    clauseKeywords: ['不得', '模糊表述', '风险揭示', '费用说明', '适当性'],
    docKeywords: ['摘要展示', '另行提供', '概括性措辞', '收益增强', '低波动'],
    label: '风险揭示与营销表述偏弱',
    impact: '销售合规与客户适当性',
    riskDrivers: ['对客披露不充分', '营销表述可能误导']
  },
  {
    id: 'auditability-gap',
    clauseKeywords: ['原始输入', '判断依据', '操作时间', '可追溯', '可审计'],
    docKeywords: ['最终结果为准', '无需长期保存', '中间判断依据'],
    label: '审计可追溯性不足',
    impact: '授信、授权、评分等关键决策可还原性',
    riskDrivers: ['关键决策依据缺失', '内部审计与监管核查困难']
  },
  {
    id: 'change-log-gap',
    clauseKeywords: ['删除', '覆盖', '批量修改', '审批链', '执行日志'],
    docKeywords: ['汇总变更记录即可', '批量修正'],
    label: '批量修改日志不足',
    impact: '数据治理与操作留痕',
    riskDrivers: ['缺少审批链', '关键数据修改不可追溯']
  },
  {
    id: 'strictness-gap',
    clauseKeywords: ['从严适用', '不一致', '修订存量制度'],
    docKeywords: ['优先按照现行内部流程执行', '后续统一评估调整'],
    label: '监管从严适用原则未落地',
    impact: '制度更新与监管一致性',
    riskDrivers: ['内部制度滞后', '监管要求落地延迟']
  }
];

const state = {
  policies: structuredClone(defaultPolicies),
  docs: structuredClone(defaultDocs),
  lastReport: null
};

function setAgentState(agentKey, status, text, summary) {
  const agent = agents[agentKey];
  agent.card.classList.remove('running', 'done');
  if (status === 'running') {
    agent.card.classList.add('running');
  }
  if (status === 'done') {
    agent.card.classList.add('done');
  }
  agent.state.textContent = text;
  if (summary) {
    agent.summary.textContent = summary;
  }
}

function resetPipeline() {
  pipelineStatus.className = 'status-badge idle';
  pipelineStatus.textContent = '待运行';
  Object.keys(agents).forEach((key) => {
    setAgentState(key, 'idle', '待运行', {
      A: '尚未生成强制性条款图谱。',
      B: '尚未执行合同、产品条款和内部制度比对。',
      C: '尚未生成带置信度的长链推理结果。',
      D: '尚未形成整改闭环。'
    }[key]);
  });
}

function renderPolicyOptions() {
  policySelect.innerHTML = '';
  state.policies.forEach((policy, index) => {
    const option = document.createElement('option');
    option.value = policy.id;
    option.textContent = `${index + 1}. ${policy.title}`;
    policySelect.appendChild(option);
  });
}

function loadSampleIntoInputs() {
  const selectedPolicy = state.policies.find((policy) => policy.id === policySelect.value) || state.policies[0];
  policyTextarea.value = selectedPolicy ? selectedPolicy.text : '';
  docsTextarea.value = state.docs.map((doc) => `【${doc.category}｜${doc.title}】\n${doc.text}`).join('\n\n');
  inputHint.textContent = '已载入内置样本，可直接运行，也可进一步修改文本后再执行审计。';
}

function detectSeverity(text) {
  let score = 1;
  const hits = [];

  Object.entries(severityKeywords).forEach(([level, keywords]) => {
    keywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        hits.push(keyword);
        if (level === 'critical') score += 3;
        if (level === 'high') score += 2;
        if (level === 'medium') score += 1;
      }
    });
  });

  let severity = '中';
  if (score >= 8) severity = '高';
  if (score >= 12) severity = '极高';

  return { score, severity, hits: [...new Set(hits)] };
}

function classifyClause(text) {
  if (text.includes('身份') || text.includes('开户')) return '客户身份识别';
  if (text.includes('交易') || text.includes('洗钱')) return '交易监测';
  if (text.includes('保存') || text.includes('留痕') || text.includes('日志')) return '留痕与审计';
  if (text.includes('报告') || text.includes('报送')) return '事件上报';
  if (text.includes('披露') || text.includes('营销') || text.includes('适当性')) return '对客披露';
  return '综合合规';
}

function splitClauses(policyText, policyMeta) {
  const rawClauses = policyText
    .split(/(?=第[一二三四五六七八九十]+条)/)
    .map((item) => item.trim())
    .filter(Boolean);

  return rawClauses.map((clauseText, index) => {
    const severity = detectSeverity(clauseText);
    return {
      id: `${policyMeta.id}-clause-${index + 1}`,
      title: clauseText.match(/第[一二三四五六七八九十]+条/)?.[0] || `条款 ${index + 1}`,
      source: policyMeta.title,
      category: classifyClause(clauseText),
      text: clauseText,
      severity,
      intent: summarizeIntent(clauseText)
    };
  });
}

function summarizeIntent(clauseText) {
  if (clauseText.includes('匿名') || clauseText.includes('身份不明')) return '强化客户身份识别，禁止身份不清客户进入业务流程。';
  if (clauseText.includes('异常交易')) return '建立覆盖高风险场景的监测、复核与留痕闭环。';
  if (clauseText.includes('保存期限')) return '确保关键资料长期可追溯，满足审计与监管核查。';
  if (clauseText.includes('24小时')) return '重大风险事件必须快速升级并按时向监管报送。';
  if (clauseText.includes('披露') || clauseText.includes('营销')) return '对客文本应充分揭示风险、费用与适当性要求。';
  if (clauseText.includes('可追溯') || clauseText.includes('判断依据')) return '关键决策应完整保留原始输入与判断依据。';
  if (clauseText.includes('审批链') || clauseText.includes('执行日志')) return '关键数据变更必须形成可审计的操作链。';
  if (clauseText.includes('从严适用')) return '当制度冲突时，应优先执行更严格的监管要求。';
  return '要求机构按照更高标准落实合规与审计控制。';
}

function normalizeDocs(inputText) {
  const custom = inputText.trim();
  if (!custom) {
    return structuredClone(state.docs);
  }

  return custom
    .split(/\n\s*\n/)
    .map((block, index) => block.trim())
    .filter(Boolean)
    .map((block, index) => ({
      id: `custom-doc-${index + 1}`,
      category: '自定义文本',
      title: `自定义业务文档 ${index + 1}`,
      owner: '用户输入',
      text: block
    }));
}

function parsePolicyInput() {
  const selectedPolicy = state.policies.find((policy) => policy.id === policySelect.value) || state.policies[0];
  const customText = policyTextarea.value.trim();
  if (customText) {
    return {
      id: 'custom-policy',
      title: '自定义政策文本',
      issuer: '用户输入',
      publishedAt: new Date().toISOString().slice(0, 10),
      summary: '由用户粘贴或上传的政策文本。',
      text: customText
    };
  }
  return selectedPolicy;
}

function overlapScore(text, keywords) {
  return keywords.reduce((score, keyword) => score + (text.includes(keyword) ? 1 : 0), 0);
}

function detectConflicts(clauses, docs) {
  const conflicts = [];

  clauses.forEach((clause) => {
    docs.forEach((doc) => {
      conflictRules.forEach((rule) => {
        const clauseScore = overlapScore(clause.text, rule.clauseKeywords);
        const docScore = overlapScore(doc.text, rule.docKeywords);
        if (clauseScore > 0 && docScore > 0) {
          conflicts.push({
            id: `${rule.id}-${doc.id}-${clause.id}`,
            ruleId: rule.id,
            label: rule.label,
            clause,
            doc,
            impact: rule.impact,
            riskDrivers: rule.riskDrivers,
            matchStrength: clauseScore + docScore,
            evidence: {
              policy: clause.text,
              doc: doc.text
            }
          });
        }
      });
    });
  });

  return conflicts.sort((a, b) => b.matchStrength - a.matchStrength);
}

function calculateRisk(conflict) {
  let score = conflict.clause.severity.score + conflict.matchStrength;

  if (conflict.impact.includes('开户') || conflict.impact.includes('反洗钱')) score += 3;
  if (conflict.impact.includes('审计') || conflict.impact.includes('可追溯')) score += 2;
  if (conflict.impact.includes('销售') || conflict.impact.includes('适当性')) score += 2;
  if (conflict.evidence.policy.includes('24小时') || conflict.evidence.policy.includes('监管部门')) score += 2;
  if (conflict.evidence.policy.includes('不得') || conflict.evidence.policy.includes('必须')) score += 2;

  let level = '低';
  if (score >= 10) level = '中';
  if (score >= 14) level = '高';
  if (score >= 18) level = '极高';

  const confidence = Math.min(98, 58 + conflict.matchStrength * 6 + Math.min(18, conflict.clause.severity.hits.length * 3));

  return {
    score,
    level,
    confidence,
    consequence: buildConsequence(conflict, level)
  };
}

function buildConsequence(conflict, level) {
  if (level === '极高') return '可能触发现场检查、整改命令、处罚或重大声誉事件。';
  if (level === '高') return '可能造成监管问询、整改压力上升及客户争议扩大。';
  if (level === '中') return '短期内可能形成审计缺口或监管解释压力。';
  return '影响相对可控，但仍需纳入制度修订排期。';
}

function buildReasoning(conflict) {
  const risk = calculateRisk(conflict);
  return {
    ...conflict,
    risk,
    chain: [
      { label: '政策原意', text: conflict.clause.intent },
      { label: '条款冲突', text: `文档《${conflict.doc.title}》中的表述与“${conflict.label}”监管要求存在偏差。` },
      { label: '业务影响范围', text: `${conflict.impact} 将直接受到影响，涉及 ${conflict.doc.owner} 的现行执行流程。` },
      { label: '潜在处罚 / 声誉风险', text: risk.consequence },
      { label: '风险分级', text: `综合评分 ${risk.score}，判定为 ${risk.level} 风险，置信度 ${risk.confidence}%。` }
    ]
  };
}

function generateRemediation(reasoning) {
  const policy = reasoning.evidence.policy;
  const docText = reasoning.evidence.doc;
  let suggestion = '建议将相关条款改写为与监管要求一致的明确义务，并补充留痕与审批机制。';
  let rewrite = docText;

  if (reasoning.ruleId === 'identity-gap') {
    suggestion = '删除“先行开立体验账户”表述，改为客户实名信息完整核验通过后方可开户。';
    rewrite = '平台仅在客户实名资料真实、完整、核验通过后开立账户，不接受匿名或身份不明客户开户。';
  } else if (reasoning.ruleId === 'monitoring-gap') {
    suggestion = '将抽样复核升级为覆盖高风险场景的持续监测，并保留详细分析记录。';
    rewrite = '平台对高频、大额、跨境及其他高风险交易进行持续识别、复核与留痕，并保存分析记录。';
  } else if (reasoning.ruleId === 'retention-gap') {
    suggestion = '将关键交易记录与风控依据保存期限统一提升至不少于五年。';
    rewrite = '涉及客户身份资料、交易记录与风控决策依据的电子信息保存期限不得少于五年。';
  } else if (reasoning.ruleId === 'reporting-gap') {
    suggestion = '明确重大风险事件 24 小时内完成内部升级并按要求对外报送。';
    rewrite = '对涉嫌洗钱、欺诈、利益输送或重大声誉风险的情形，应在发现后24小时内完成内部升级报告并按要求报送。';
  } else if (reasoning.ruleId === 'disclosure-gap') {
    suggestion = '禁止模糊化营销措辞，完整披露风险、费用与适当性要求。';
    rewrite = '风险揭示、费用说明与适当性判断应完整呈现，不得以概括性或摘要性表述替代。';
  } else if (reasoning.ruleId === 'auditability-gap') {
    suggestion = '补充原始输入、判断依据与时间戳保存要求，保证关键决策可追溯。';
    rewrite = '客户授权、适当性评分与费率调整等关键数据应同步保存原始输入、判断依据与操作时间。';
  } else if (reasoning.ruleId === 'change-log-gap') {
    suggestion = '为关键字段的删除、覆盖与批量修改保留审批链和执行日志。';
    rewrite = '任何删除、覆盖、批量修改关键业务数据的操作，均应保留操作人、审批链与执行日志。';
  } else if (reasoning.ruleId === 'strictness-gap') {
    suggestion = '当内部制度与监管要求不一致时，直接适用更严格监管标准并立即启动制度修订。';
    rewrite = '内部制度与监管要求不一致时，应从严适用监管要求，并及时修订存量制度及对客文本。';
  }

  const residual = reassessResidualRisk(reasoning, rewrite, policy);
  return {
    ...reasoning,
    suggestion,
    rewrite,
    residual
  };
}

function reassessResidualRisk(reasoning, rewrite, policyText) {
  let score = Math.max(4, reasoning.risk.score - 6);
  if (rewrite.includes('不得') || rewrite.includes('应') || rewrite.includes('必须')) score -= 2;
  if (rewrite.includes('留痕') || rewrite.includes('审批链') || rewrite.includes('日志') || rewrite.includes('五年')) score -= 1;
  score = Math.max(2, score);

  let level = '低';
  if (score >= 9) level = '中';
  if (score >= 13) level = '高';
  if (score >= 17) level = '极高';

  const confidence = Math.min(96, reasoning.risk.confidence - 4 + (rewrite.length > 40 ? 4 : 0));
  const delta = reasoning.risk.score - score;

  return {
    score,
    level,
    confidence,
    delta,
    note: delta >= 6 ? '整改后核心冲突已显著收敛，但仍建议纳入制度复核与抽样检查。'
      : '整改后风险有所下降，但仍需补充配套流程与控制措施。'
  };
}

function renderClauses(clauses) {
  if (!clauses.length) {
    clauseGraph.className = 'stack-list empty-state';
    clauseGraph.textContent = '没有解析出有效条款。';
    clauseCountBadge.textContent = '0 条';
    return;
  }

  clauseGraph.className = 'stack-list';
  clauseGraph.innerHTML = clauses.map((clause) => `
    <article class="clause-card">
      <div class="meta-row">
        <h3>${clause.title} · ${clause.category}</h3>
        <span class="tag">严重性：${clause.severity.severity}</span>
      </div>
      <p>${clause.text}</p>
      <div class="kv-grid">
        <div class="kv-box"><span class="kv-label">来源政策</span><span class="kv-value">${clause.source}</span></div>
        <div class="kv-box"><span class="kv-label">意图摘要</span><span class="kv-value">${clause.intent}</span></div>
      </div>
      <div class="tag-row">${clause.severity.hits.map((hit) => `<span class="tag">${hit}</span>`).join('')}</div>
    </article>
  `).join('');
  clauseCountBadge.textContent = `${clauses.length} 条`;
}

function renderConflicts(conflicts) {
  if (!conflicts.length) {
    conflictList.className = 'stack-list empty-state';
    conflictList.textContent = '没有发现明显冲突点。';
    conflictCountBadge.textContent = '0 项';
    return;
  }

  conflictList.className = 'stack-list';
  conflictList.innerHTML = conflicts.map((conflict) => `
    <article class="conflict-card">
      <div class="meta-row">
        <h3>${conflict.label}</h3>
        <span class="tag">命中强度：${conflict.matchStrength}</span>
      </div>
      <p class="small-text">${conflict.doc.category} · ${conflict.doc.title} · 责任归属：${conflict.doc.owner}</p>
      <div class="evidence-block">
        <strong>政策依据</strong>
        <p>${conflict.evidence.policy}</p>
      </div>
      <div class="evidence-block">
        <strong>业务文本</strong>
        <p>${conflict.evidence.doc}</p>
      </div>
      <div class="tag-row">
        <span class="tag">影响范围：${conflict.impact}</span>
        ${conflict.riskDrivers.map((driver) => `<span class="tag">${driver}</span>`).join('')}
      </div>
    </article>
  `).join('');
  conflictCountBadge.textContent = `${conflicts.length} 项`;
}

function renderRiskMatrix(reasonings) {
  if (!reasonings.length) {
    riskMatrix.className = 'matrix-shell empty-state';
    riskMatrix.textContent = '没有可展示的风险矩阵。';
    reasoningList.className = 'reasoning-list empty-state';
    reasoningList.textContent = '没有可展示的推理链。';
    return;
  }

  const counts = {
    high: reasonings.filter((item) => item.risk.level === '极高' || item.risk.level === '高').length,
    medium: reasonings.filter((item) => item.risk.level === '中').length,
    low: reasonings.filter((item) => item.risk.level === '低').length
  };

  const avgScore = Math.round(reasonings.reduce((sum, item) => sum + item.risk.score, 0) / reasonings.length);
  const avgConfidence = Math.round(reasonings.reduce((sum, item) => sum + item.risk.confidence, 0) / reasonings.length);

  riskMatrix.className = 'matrix-shell';
  riskMatrix.innerHTML = `
    <div class="matrix-grid">
      <article class="matrix-cell">
        <span class="metric-label">高风险 / 极高风险</span>
        <strong class="metric-value high">${counts.high}</strong>
      </article>
      <article class="matrix-cell">
        <span class="metric-label">中风险</span>
        <strong class="metric-value medium">${counts.medium}</strong>
      </article>
      <article class="matrix-cell">
        <span class="metric-label">低风险</span>
        <strong class="metric-value low">${counts.low}</strong>
      </article>
      <article class="matrix-cell">
        <span class="metric-label">平均风险评分</span>
        <strong class="metric-value">${avgScore}</strong>
      </article>
      <article class="matrix-cell">
        <span class="metric-label">平均置信度</span>
        <strong class="metric-value">${avgConfidence}%</strong>
      </article>
    </div>
  `;

  reasoningList.className = 'reasoning-list';
  reasoningList.innerHTML = reasonings.map((reasoning) => `
    <article class="reasoning-card">
      <div class="meta-row">
        <h3>${reasoning.label}</h3>
        <div class="risk-summary">
          <span class="risk-chip ${mapRiskClass(reasoning.risk.level)}">${reasoning.risk.level}风险</span>
          <span class="confidence-chip">置信度 ${reasoning.risk.confidence}%</span>
        </div>
      </div>
      <p class="small-text">影响业务范围：${reasoning.impact}</p>
      <ol class="timeline">
        ${reasoning.chain.map((step) => `<li><strong>${step.label}</strong>：${step.text}</li>`).join('')}
      </ol>
      <div class="tag-row">
        <span class="tag">引用政策：${reasoning.clause.source}</span>
        <span class="tag">引用文档：${reasoning.doc.title}</span>
      </div>
    </article>
  `).join('');
}

function renderRemediations(items) {
  if (!items.length) {
    remediationList.className = 'stack-list empty-state';
    remediationList.textContent = '没有需要整改的项目。';
    return;
  }

  remediationList.className = 'stack-list';
  remediationList.innerHTML = items.map((item) => `
    <article class="remediation-card">
      <div class="meta-row">
        <h3>${item.label}</h3>
        <div class="risk-summary">
          <span class="risk-chip ${mapRiskClass(item.risk.level)}">整改前：${item.risk.level}</span>
          <span class="risk-chip ${mapRiskClass(item.residual.level)}">整改后：${item.residual.level}</span>
        </div>
      </div>
      <p>${item.suggestion}</p>
      <div class="rewrite-block">
        <strong>建议改写</strong>
        <p>${item.rewrite}</p>
      </div>
      <div class="kv-grid">
        <div class="kv-box"><span class="kv-label">整改前评分</span><span class="kv-value">${item.risk.score}</span></div>
        <div class="kv-box"><span class="kv-label">整改后评分</span><span class="kv-value">${item.residual.score}</span></div>
        <div class="kv-box"><span class="kv-label">风险下降</span><span class="kv-value">${item.residual.delta}</span></div>
        <div class="kv-box"><span class="kv-label">整改后置信度</span><span class="kv-value">${item.residual.confidence}%</span></div>
      </div>
      <p class="small-text">${item.residual.note}</p>
    </article>
  `).join('');
}

function mapRiskClass(level) {
  if (level === '极高' || level === '高') return 'high';
  if (level === '中') return 'medium';
  return 'low';
}

function updateSummary(clauses, conflicts, reasonings, remediations, policy, docs) {
  const highCount = reasonings.filter((item) => item.risk.level === '极高' || item.risk.level === '高').length;
  const avgConfidence = reasonings.length
    ? Math.round(reasonings.reduce((sum, item) => sum + item.risk.confidence, 0) / reasonings.length)
    : 0;

  statClauses.textContent = String(clauses.length);
  statConflicts.textContent = String(conflicts.length);
  statHigh.textContent = String(highCount);
  statConfidence.textContent = `${avgConfidence}%`;

  const topRisk = reasonings[0];
  summaryNarrative.textContent = reasonings.length
    ? `本次审计共解析《${policy.title}》中的 ${clauses.length} 条强制性要求，并在 ${docs.length} 份业务文本中识别出 ${conflicts.length} 个潜在冲突点，其中 ${highCount} 个属于高风险或极高风险。当前最值得优先整改的是“${topRisk.label}”，其风险等级为 ${topRisk.risk.level}，主要影响 ${topRisk.impact}。完成建议整改后，系统预计该项风险评分可下降 ${remediations[0]?.residual.delta ?? 0} 分。`
    : '本次没有识别出明显冲突，可将当前文本作为初步合规基线。';
}

function parseUploadedPolicy(content) {
  const trimmed = content.trim();
  if (!trimmed) return;
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      state.policies = parsed;
      renderPolicyOptions();
      loadSampleIntoInputs();
      inputHint.textContent = '已导入政策 JSON，并刷新样本列表。';
      return;
    }
  } catch {
  }

  policyTextarea.value = trimmed;
  inputHint.textContent = '已导入政策文本，将在运行时优先使用该文本。';
}

function parseUploadedDocs(content) {
  const trimmed = content.trim();
  if (!trimmed) return;
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      state.docs = parsed;
      loadSampleIntoInputs();
      inputHint.textContent = '已导入业务文档 JSON，并替换默认样本。';
      return;
    }
  } catch {
  }

  docsTextarea.value = trimmed;
  inputHint.textContent = '已导入业务文本，将在运行时优先使用该文本。';
}

function readFile(file, onLoad) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => onLoad(String(reader.result || ''));
  reader.readAsText(file, 'utf-8');
}

function runAudit() {
  resetPipeline();
  pipelineStatus.className = 'status-badge running';
  pipelineStatus.textContent = '运行中';

  const policy = parsePolicyInput();
  const docs = normalizeDocs(docsTextarea.value);

  setAgentState('A', 'running', '运行中', '正在解析政策结构并提取强制性条款。');
  const clauses = splitClauses(policy.text, policy);
  setAgentState('A', 'done', '已完成', `已拆解 ${clauses.length} 条强制性要求，覆盖 ${new Set(clauses.map((item) => item.category)).size} 个主题。`);
  renderClauses(clauses);

  setAgentState('B', 'running', '运行中', '正在遍历业务文档并标注潜在冲突。');
  const conflicts = detectConflicts(clauses, docs);
  setAgentState('B', 'done', '已完成', `在 ${docs.length} 份业务文本中识别出 ${conflicts.length} 个潜在冲突点。`);
  renderConflicts(conflicts);

  setAgentState('C', 'running', '运行中', '正在执行长链推理与风险分级。');
  const reasonings = conflicts.map(buildReasoning).sort((a, b) => b.risk.score - a.risk.score);
  setAgentState('C', 'done', '已完成', `已生成 ${reasonings.length} 条可解释推理链，并输出风险矩阵。`);
  renderRiskMatrix(reasonings);

  setAgentState('D', 'running', '运行中', '正在生成整改建议并重新评估残余风险。');
  const remediations = reasonings
    .filter((item) => item.risk.level === '极高' || item.risk.level === '高' || item.risk.level === '中')
    .map(generateRemediation);
  setAgentState('D', 'done', '已完成', `已为 ${remediations.length} 个重点问题生成整改建议并完成闭环再评估。`);
  renderRemediations(remediations);

  updateSummary(clauses, conflicts, reasonings, remediations, policy, docs);

  pipelineStatus.className = 'status-badge done';
  pipelineStatus.textContent = '运行完成';

  state.lastReport = { policy, docs, clauses, conflicts, reasonings, remediations, generatedAt: new Date().toLocaleString() };
}

function exportReport() {
  if (!state.lastReport) {
    inputHint.textContent = '请先运行一次审计，再导出报告。';
    return;
  }

  const { policy, docs, clauses, conflicts, reasonings, remediations, generatedAt } = state.lastReport;
  const lines = [
    '全自动合规审计与政策影响分析 Agent · 导出报告',
    `生成时间：${generatedAt}`,
    '',
    `政策：${policy.title}`,
    `业务文档数量：${docs.length}`,
    `政策条款：${clauses.length}`,
    `冲突点：${conflicts.length}`,
    `高风险项：${reasonings.filter((item) => item.risk.level === '极高' || item.risk.level === '高').length}`,
    '',
    '一、主要风险项',
    ...reasonings.map((item, index) => `${index + 1}. ${item.label}｜等级：${item.risk.level}｜置信度：${item.risk.confidence}%｜影响：${item.impact}`),
    '',
    '二、整改建议',
    ...remediations.map((item, index) => `${index + 1}. ${item.label}\n建议：${item.suggestion}\n整改后等级：${item.residual.level}｜评分下降：${item.residual.delta}`)
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = '合规审计报告.txt';
  link.click();
  URL.revokeObjectURL(url);
}

loadSampleButton.addEventListener('click', loadSampleIntoInputs);
runButton.addEventListener('click', runAudit);
exportButton.addEventListener('click', exportReport);
policyFileInput.addEventListener('change', (event) => readFile(event.target.files?.[0], parseUploadedPolicy));
docFileInput.addEventListener('change', (event) => readFile(event.target.files?.[0], parseUploadedDocs));
policySelect.addEventListener('change', loadSampleIntoInputs);

docSelect.addEventListener('change', () => {
  loadSampleIntoInputs();
});

renderPolicyOptions();
loadSampleIntoInputs();
resetPipeline();
