/* =========================================================
   별빛 사주 — 사주 계산 & 렌더링
   계산 로직은 saju-fortune 패키지(pillars.js / readings.js)를
   브라우저용으로 옮긴 것입니다.
   ========================================================= */

const STEMS = [
  { ko: "갑", hanja: "甲", element: "wood", yinYang: "yang" },
  { ko: "을", hanja: "乙", element: "wood", yinYang: "yin" },
  { ko: "병", hanja: "丙", element: "fire", yinYang: "yang" },
  { ko: "정", hanja: "丁", element: "fire", yinYang: "yin" },
  { ko: "무", hanja: "戊", element: "earth", yinYang: "yang" },
  { ko: "기", hanja: "己", element: "earth", yinYang: "yin" },
  { ko: "경", hanja: "庚", element: "metal", yinYang: "yang" },
  { ko: "신", hanja: "辛", element: "metal", yinYang: "yin" },
  { ko: "임", hanja: "壬", element: "water", yinYang: "yang" },
  { ko: "계", hanja: "癸", element: "water", yinYang: "yin" }
];

const BRANCHES = [
  { ko: "자", hanja: "子", animal: "쥐", element: "water" },
  { ko: "축", hanja: "丑", animal: "소", element: "earth" },
  { ko: "인", hanja: "寅", animal: "호랑이", element: "wood" },
  { ko: "묘", hanja: "卯", animal: "토끼", element: "wood" },
  { ko: "진", hanja: "辰", animal: "용", element: "earth" },
  { ko: "사", hanja: "巳", animal: "뱀", element: "fire" },
  { ko: "오", hanja: "午", animal: "말", element: "fire" },
  { ko: "미", hanja: "未", animal: "양", element: "earth" },
  { ko: "신", hanja: "申", animal: "원숭이", element: "metal" },
  { ko: "유", hanja: "酉", animal: "닭", element: "metal" },
  { ko: "술", hanja: "戌", animal: "개", element: "earth" },
  { ko: "해", hanja: "亥", animal: "돼지", element: "water" }
];

const ELEMENT_CYCLE = ["wood", "fire", "earth", "metal", "water"];

const ELEMENTS = {
  wood: {
    ko: "목",
    hanja: "木",
    label: "목(木)",
    color: "#a9d6bd",
    keyword: "성장",
    desc: "성장과 시작의 기운",
    plenty: "밀고 나가는 추진력이 좋아요",
    short: "시작이 느려질 수 있어요, 산책과 스트레칭으로 채워요"
  },
  fire: {
    ko: "화",
    hanja: "火",
    label: "화(火)",
    color: "#ffb3c6",
    keyword: "온기",
    desc: "열정과 표현의 기운",
    plenty: "기분이 환하고 말이 잘 통해요",
    short: "의욕이 쉽게 식어요, 햇빛과 따뜻한 차로 채워요"
  },
  earth: {
    ko: "토",
    hanja: "土",
    label: "토(土)",
    color: "#f2dcb9",
    keyword: "안정",
    desc: "안정과 중심의 기운",
    plenty: "중심이 단단해 쉽게 흔들리지 않아요",
    short: "체력의 바탕이 비어요, 규칙적인 식사로 채워요"
  },
  metal: {
    ko: "금",
    hanja: "金",
    label: "금(金)",
    color: "#d8d2ec",
    keyword: "결단",
    desc: "결단과 정리의 기운",
    plenty: "맺고 끊는 판단이 빨라요",
    short: "마무리가 흐려져요, 정리 습관으로 채워요"
  },
  water: {
    ko: "수",
    hanja: "水",
    label: "수(水)",
    color: "#b9d8ef",
    keyword: "흐름",
    desc: "흐름과 회복의 기운",
    plenty: "생각이 깊고 유연하게 흘러요",
    short: "회복이 느려져요, 물과 수면으로 채워요"
  }
};

/* 오늘의 기운 태그 */
const ELEMENT_TAGS = {
  wood: ["새 시작", "성장", "산책"],
  fire: ["표현", "열정", "만남"],
  earth: ["안정", "정리", "든든함"],
  metal: ["결단", "마무리", "정돈"],
  water: ["휴식", "사색", "흐름"]
};

const ELEMENT_DAYLINE = {
  wood: "새로 시작하기 좋은 날이에요. 몸을 움직이면 기운이 트여요.",
  fire: "마음이 환해지는 날이에요. 표현할수록 좋아져요.",
  earth: "천천히 가도 괜찮은 날이에요. 정리와 따뜻한 식사가 힘이 돼요.",
  metal: "미뤄둔 일을 마무리하기 좋은 날이에요. 맺고 끊는 결단이 잘 통해요.",
  water: "생각이 깊어지는 날이에요. 혼자만의 시간이 약이 돼요."
};

/* 오늘의 일진과 내 일간의 관계 */
const DAY_RELATION = {
  비겁: {
    name: "나와 같은 기운이 도는 날",
    summary: "내 페이스가 그대로 통하는 날이에요. 다만 힘이 겹치면 고집으로 보일 수 있어요.",
    guidance: [
      "결정을 혼자 밀어붙이기보다 한 번 더 물어보세요.",
      "약속을 조금 줄이고 체력을 아끼면 하루가 편안해져요."
    ]
  },
  식상: {
    name: "내 기운이 밖으로 흐르는 날",
    summary: "말과 표현이 잘 통하는 날이에요. 만들고, 쓰고, 이야기하는 일에 힘이 붙어요.",
    guidance: [
      "하고 싶던 말이 있다면 오늘 꺼내보세요.",
      "집중력이 흩어지기 쉬우니 한 가지에만 붙잡으세요."
    ]
  },
  재성: {
    name: "성과가 눈에 보이는 날",
    summary: "실무 감각과 돈을 다루는 감각이 올라오는 날이에요. 결과로 확인되는 하루예요.",
    guidance: [
      "미뤄둔 실무와 서류를 오늘 처리해 보세요.",
      "지출은 한 번 더 확인하면 새는 돈을 막을 수 있어요."
    ]
  },
  관성: {
    name: "책임이 조금 무거워지는 날",
    summary: "해야 할 일이 먼저 눈에 들어오는 날이에요. 규칙을 지키면 오히려 마음이 편해져요.",
    guidance: [
      "약속과 마감을 아침에 미리 정리해 두세요.",
      "몸이 긴장하기 쉬우니 어깨와 목을 자주 풀어주세요."
    ]
  },
  인성: {
    name: "도움과 회복이 들어오는 날",
    summary: "배움과 쉼이 잘 맞는 날이에요. 누군가의 조언이 오래 남을 수 있어요.",
    guidance: [
      "책·강의·정리 노트처럼 머리에 담는 일이 잘 돼요.",
      "사람보다 혼자 충전하는 시간이 회복에 도움이 돼요."
    ]
  }
};

/* 일간 열 가지의 짧은 기질 */
const STEM_STORY = {
  갑: "큰 나무처럼 곧게 자라려는 사람",
  을: "덩굴처럼 부드럽게 감아오르는 사람",
  병: "한낮의 햇살처럼 환하게 비추는 사람",
  정: "촛불처럼 곁을 따뜻하게 밝히는 사람",
  무: "큰 산처럼 묵직하게 자리를 지키는 사람",
  기: "기름진 논밭처럼 품어 키우는 사람",
  경: "벼려진 쇠처럼 단단하고 결단 있는 사람",
  신: "보석처럼 맑고 섬세한 사람",
  임: "깊은 바다처럼 넓게 품는 사람",
  계: "이슬비처럼 조용히 스며드는 사람"
};

/* 오행별 생활 처방 */
const ELEMENT_TIP = {
  wood: "초록을 가까이하고, 몸을 쭉 펴는 스트레칭과 산책이 잘 맞아요.",
  fire: "햇빛을 쬐고 따뜻한 차 한 잔으로 몸을 데워주면 기운이 돌아와요.",
  earth: "식사 시간을 규칙적으로 지키고, 뿌리채소처럼 든든한 음식이 좋아요.",
  metal: "호흡을 길게, 공간을 정리하고 피부 보습을 챙기면 마음이 가벼워져요.",
  water: "물을 자주 마시고 잠을 충분히 자는 것이 가장 좋은 회복법이에요."
};

const STRENGTH_TEXT = {
  strong: {
    label: "기운이 넘치는 편",
    text: "힘이 강한 만큼 밀어붙이기보다, 중간에 한 번 쉬어가는 여백이 필요해요."
  },
  balanced: {
    label: "균형 잡힌 편",
    text: "크게 기울지 않은 사주예요. 그래서 작은 습관이 오래 쌓일 때 차이가 크게 나요."
  },
  weak: {
    label: "섬세한 편",
    text: "주변의 기운을 잘 받는 대신, 회복 루틴을 만들어두면 훨씬 편안해져요."
  }
};

/* 주제별 문구 — saju-fortune readings.js 기반 + 힐링 톤 */
const TOPICS = {
  general: {
    label: "종합운",
    title: "지금은 어떤 계절을 지나고 있을까요",
    summary: (d, w) =>
      `${d} 기운이 크게 흐르고, ${w} 기운은 조금 비어 있는 사주예요. 타고난 강점은 그대로 살리고, 비어 있는 기운은 생활 루틴으로 다정하게 채워주면 좋아요.`,
    guidance: [
      "강한 기운이 지나치게 몰리는 순간을 먼저 알아차려요.",
      "부족한 기운은 사람·공간·습관으로 천천히 보완해요."
    ]
  },
  wealth: {
    label: "재물운",
    title: "돈의 흐름을 부드럽게 만드는 법",
    summary: (d) =>
      `재물운은 강한 ${d} 기운을 ‘규칙’으로 묶을 때 편안해져요. 크게 한 번보다, 반복 가능한 작은 원칙이 오래 갑니다.`,
    guidance: [
      "큰 결정보다 반복 가능한 예산 규칙을 먼저 세워요.",
      "수입과 지출을 나눠서 흐름을 눈으로 확인해요."
    ]
  },
  love: {
    label: "연애운",
    title: "마음을 전하는 속도에 대하여",
    summary: (d) =>
      `연애운은 표현의 속도와 안정감을 맞추는 쪽으로 흘러요. 강한 ${d} 기운은 매력이지만, 조금 과하면 고집으로 보일 수 있어요.`,
    guidance: [
      "호감은 선명하게, 결론은 천천히 잡아요.",
      "상대의 반응 속도를 존중하면 관계가 훨씬 편안해져요."
    ]
  },
  career: {
    label: "직업운",
    title: "오늘의 자리에서 빛나는 법",
    summary: (d) =>
      `직업운은 맡은 역할의 중심을 잡을 때 안정돼요. 강한 ${d} 기운을 성과의 언어로 바꾸는 전략이 잘 맞아요.`,
    guidance: [
      "역할과 책임의 범위를 명확하게 그어두세요.",
      "성과를 짧게 기록하고 자주 돌아보면 흐름이 보여요."
    ]
  },
  health: {
    label: "건강운",
    title: "몸이 보내는 작은 신호들",
    summary: (_, w) =>
      `건강운은 비어 있는 ${w} 기운을 채우는 수면·식사·움직임의 균형에서 봐요. 사주는 진단이 아니라 돌봄의 힌트예요.`,
    guidance: [
      "무리한 해석보다 컨디션 기록을 먼저 남겨요.",
      "증상이 이어지면 사주보다 진료를 먼저 찾아요."
    ]
  }
};

/* ---------- 계산 ---------- */

function mod(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function makePillar(stemIndex, branchIndex) {
  const stem = STEMS[stemIndex];
  const branch = BRANCHES[branchIndex];
  return {
    label: stem.ko + branch.ko,
    hanja: stem.hanja + branch.hanja,
    stem: stem.ko,
    stemHanja: stem.hanja,
    stemElement: stem.element,
    branch: branch.ko,
    branchHanja: branch.hanja,
    branchAnimal: branch.animal,
    branchElement: branch.element,
    yinYang: stem.yinYang,
    stemIndex: stemIndex,
    branchIndex: branchIndex
  };
}

function getSolarTermMonthIndex(month, day) {
  const starts = [
    [2, 4], [3, 6], [4, 5], [5, 6], [6, 6], [7, 7],
    [8, 8], [9, 8], [10, 8], [11, 7], [12, 7], [1, 6]
  ];
  const value = month * 100 + day;
  for (let i = 10; i >= 0; i -= 1) {
    if (value >= starts[i][0] * 100 + starts[i][1]) return i;
  }
  return 11;
}

function calcPillars(year, month, day, hour) {
  const sajuYear = month < 2 || (month === 2 && day < 4) ? year - 1 : year;
  const yearPillar = makePillar(mod(sajuYear - 4, 10), mod(sajuYear - 4, 12));

  const monthIndex = getSolarTermMonthIndex(month, day);
  const branchIndex = mod(monthIndex + 2, 12);
  const y = yearPillar.stemIndex;
  let monthStemStart;
  if (y === 0 || y === 5) monthStemStart = 2;
  else if (y === 1 || y === 6) monthStemStart = 4;
  else if (y === 2 || y === 7) monthStemStart = 6;
  else if (y === 3 || y === 8) monthStemStart = 8;
  else monthStemStart = 0;

  const monthOffset = branchIndex >= 2 ? branchIndex - 2 : branchIndex + 10;
  const monthPillar = makePillar(mod(monthStemStart + monthOffset, 10), branchIndex);

  const base = Date.UTC(1900, 0, 1, 12);
  const birth = Date.UTC(year, month - 1, day, 12);
  const diffDays = Math.round((birth - base) / 86400000);
  const dayPillar = makePillar(mod(diffDays, 10), mod(10 + diffDays, 12));

  let hourPillar = null;
  if (hour !== null && hour !== undefined) {
    const hb = hour >= 23 || hour < 1 ? 0 : Math.floor((hour + 1) / 2);
    hourPillar = makePillar(mod(dayPillar.stemIndex * 2 + hb, 10), hb);
  }

  return { year: yearPillar, month: monthPillar, day: dayPillar, hour: hourPillar };
}

function countElements(pillars) {
  const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  Object.values(pillars).forEach(function (p) {
    if (!p) return;
    counts[p.stemElement] += 1;
    counts[p.branchElement] += 1;
  });
  return counts;
}

function dominantElements(counts) {
  const max = Math.max.apply(null, Object.values(counts));
  return ELEMENT_CYCLE.filter(function (e) {
    return counts[e] === max && max > 0;
  });
}

function weakElements(counts) {
  const min = Math.min.apply(null, Object.values(counts));
  return ELEMENT_CYCLE.filter(function (e) {
    return counts[e] === min;
  });
}

function generatingElement(element) {
  return ELEMENT_CYCLE[mod(ELEMENT_CYCLE.indexOf(element) - 1, 5)];
}

function controllingElement(element) {
  return { wood: "metal", fire: "water", earth: "wood", metal: "fire", water: "earth" }[element];
}

/* 내가 극하는(다스리는) 오행 = 재성 */
function controlledElement(element) {
  return ELEMENT_CYCLE[mod(ELEMENT_CYCLE.indexOf(element) + 2, 5)];
}

/* 오늘 일진과 내 일간의 십성 관계 */
function relationOf(dayElement, todayElement) {
  if (dayElement === todayElement) return "비겁";
  if (controlledElement(dayElement) === todayElement) return "재성";
  if (controlledElement(todayElement) === dayElement) return "관성";
  if (ELEMENT_CYCLE[mod(ELEMENT_CYCLE.indexOf(dayElement) + 1, 5)] === todayElement) return "식상";
  return "인성";
}

function todayPillar(date) {
  const d = date || new Date();
  const p = calcPillars(d.getFullYear(), d.getMonth() + 1, d.getDate(), null);
  return { date: d, day: p.day };
}

function dayMasterStrength(pillars, counts) {
  const el = pillars.day.stemElement;
  const supporting = counts[el] + counts[generatingElement(el)] * 0.7;
  if (supporting >= 3.5) return "strong";
  if (supporting <= 1.5) return "weak";
  return "balanced";
}

function usefulElements(pillars, counts, strength) {
  const weak = weakElements(counts);
  const generated = ELEMENT_CYCLE[mod(ELEMENT_CYCLE.indexOf(pillars.day.stemElement) + 1, 5)];
  const primary =
    strength === "strong" ? controllingElement(pillars.day.stemElement) : generatingElement(pillars.day.stemElement);
  const secondary = weak.indexOf(generated) >= 0 ? generated : weak[0];
  return { primary: primary, secondary: secondary };
}

function analyze(birth, timeUnknown) {
  const year = birth.getFullYear();
  const month = birth.getMonth() + 1;
  const day = birth.getDate();
  const hour = timeUnknown ? null : birth.getHours();

  const pillars = calcPillars(year, month, day, hour);
  const counts = countElements(pillars);
  const dominant = dominantElements(counts);
  const weak = weakElements(counts);
  const strength = dayMasterStrength(pillars, counts);
  const useful = usefulElements(pillars, counts, strength);

  return {
    pillars: pillars,
    counts: counts,
    dominant: dominant,
    weak: weak,
    strength: strength,
    useful: useful
  };
}

/* ---------- 렌더링 ---------- */

const fmt = {
  list: function (arr) {
    return arr.map(function (e) {
      return ELEMENTS[e].label;
    }).join(" · ");
  },
  listKo: function (arr) {
    return arr.map(function (e) {
      return ELEMENTS[e].ko;
    }).join("·");
  }
};

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function renderPillars(pillars) {
  const wrap = document.getElementById("pillars");
  wrap.textContent = "";
  const order = [
    { key: "year", label: "연주" },
    { key: "month", label: "월주" },
    { key: "day", label: "일주" },
    { key: "hour", label: "시주" }
  ];

  order.forEach(function (item, index) {
    const p = pillars[item.key];
    const card = el("div", "pillar" + (p ? "" : " pillar--empty"));
    card.style.animationDelay = index * 0.08 + "s";

    card.appendChild(el("span", "pillar__label", item.label));
    card.appendChild(el("span", "pillar__hanja", p ? p.hanja : "？"));
    card.appendChild(el("span", "pillar__korean", p ? p.label : "시간 모름"));
    card.appendChild(el("span", "pillar__animal", p ? p.branchAnimal + " · " + ELEMENTS[p.stemElement].ko : "—"));

    wrap.appendChild(card);
  });
}

function renderElements(counts, dominant, weak) {
  const max = Math.max.apply(null, Object.values(counts));

  const lead = document.getElementById("elements-lead");
  lead.textContent =
    fmt.list(dominant) + " 기운이 넉넉하고, " + fmt.list(weak) + " 기운은 조금 비어 있어요.";

  const bars = document.getElementById("element-bars");
  bars.textContent = "";

  ELEMENT_CYCLE.forEach(function (key, i) {
    const count = counts[key];
    const meta = ELEMENTS[key];
    const isFlat = max === Math.min.apply(null, Object.values(counts));

    let state;
    if (isFlat) state = "고르게 흐르고 있어요";
    else if (count === max) state = meta.plenty;
    else if (count === Math.min.apply(null, Object.values(counts))) state = meta.short;
    else state = "무난하게 흐르고 있어요";

    const row = el("div", "bar" + (count === max ? " bar--max" : "") + (count === 0 ? " bar--zero" : ""));

    const line = el("div", "bar__row");
    const name = el("span", "bar__name");
    name.appendChild(document.createTextNode(meta.ko));
    name.appendChild(el("small", null, meta.hanja));

    const track = el("div", "bar__track");
    const fill = el("div", "bar__fill");
    fill.style.setProperty("--bar-color", meta.color);
    fill.dataset.width = Math.round((count / max) * 100) + "%";
    track.appendChild(fill);

    const value = el("span", "bar__value", String(count));

    line.appendChild(name);
    line.appendChild(track);
    line.appendChild(value);

    const desc = el("p", "bar__desc", meta.desc + " · " + state);

    row.appendChild(line);
    row.appendChild(desc);
    bars.appendChild(row);

    window.setTimeout(function () {
      fill.style.width = fill.dataset.width;
    }, 120 + i * 90);
  });
}

function renderDayMaster(pillars, strength, useful) {
  const wrap = document.getElementById("daymaster");
  wrap.textContent = "";

  const hanja = el("span", "daymaster__hanja", pillars.day.stemHanja);
  const text = el("span", "daymaster__text");
  const strong = el("strong", null, pillars.day.stem + " " + ELEMENTS[pillars.day.stemElement].ko + " 일간");
  text.appendChild(strong);
  text.appendChild(document.createTextNode(STEM_STORY[pillars.day.stem]));

  wrap.appendChild(hanja);
  wrap.appendChild(text);

  const tags = document.getElementById("daymaster-tags");
  tags.textContent = "";
  tags.appendChild(el("span", "tag", STRENGTH_TEXT[strength].label));
  tags.appendChild(el("span", "tag tag--soft", "조율점 " + ELEMENTS[useful.primary].label));
  tags.appendChild(el("span", "tag tag--soft", "보조 " + ELEMENTS[useful.secondary].label));

  document.getElementById("daymaster-note").textContent = STRENGTH_TEXT[strength].text;
}

function renderFortune(result, topic, targetYear, timeUnknown, name) {
  const data = TOPICS[topic];
  const dom = result.dominant.map(function (e) {
    return ELEMENTS[e].ko;
  }).join("·");
  const wk = result.weak.map(function (e) {
    return ELEMENTS[e].ko;
  }).join("·");

  document.getElementById("fortune-badge").textContent = data.label;

  const yp = makePillar(mod(targetYear - 4, 10), mod(targetYear - 4, 12));
  document.getElementById("fortune-year").textContent = targetYear + "년 · " + yp.label + "년";

  document.getElementById("fortune-title").textContent = data.title;
  document.getElementById("fortune-summary").textContent = data.summary(dom, wk);

  const ul = document.getElementById("fortune-guidance");
  ul.textContent = "";
  data.guidance.forEach(function (line) {
    ul.appendChild(el("li", null, line));
  });

  const tip = document.getElementById("fortune-tip");
  tip.textContent = "";
  tip.appendChild(el("strong", null, "별빛 한마디"));
  tip.appendChild(
    document.createTextNode(
      STEM_STORY[result.pillars.day.stem] +
        "예요. " +
        ELEMENT_TIP[result.dominant[0]] +
        " " +
        ELEMENT_TIP[result.weak[0]]
    )
  );

  const caveats = ["사주 풀이는 결정론이나 보장이 아니라 자기점검을 돕는 전통 해석입니다."];
  if (timeUnknown) {
    caveats.push("태어난 시간을 몰라 시주는 확정하지 않고 연·월·일 중심으로 보수적으로 해석했습니다.");
  }
  document.getElementById("fortune-caveat").textContent = caveats.join(" ");

  const eyebrow = document.getElementById("result-eyebrow");
  eyebrow.textContent = name ? name + "님의 별이 답을 내려보냈어요" : "별이 답을 내려보냈어요";

  document.getElementById("result-sub").textContent =
    (timeUnknown ? "태어난 시각을 모르는 상태로, 연·월·일 세 기둥을 중심으로 읽었어요." : "네 기둥을 모두 담아 읽었어요.") +
    " 정답이 아니라, 나를 알아가는 참고로만 봐주세요.";
}

/* 오늘의 운세 */

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function formatDateKo(date) {
  return date.getMonth() + 1 + "월 " + date.getDate() + "일 (" + WEEKDAYS[date.getDay()] + ")";
}

function renderToday() {
  const info = todayPillar();
  const day = info.day;
  const element = day.stemElement;

  document.getElementById("today-date").textContent = formatDateKo(info.date);
  document.getElementById("today-hanja").textContent = day.hanja;
  document.getElementById("today-label").textContent = day.label + "일";
  document.getElementById("today-line").textContent =
    day.stem + day.branch + "일 · " + ELEMENTS[element].ko + "(" + ELEMENTS[element].hanja + ") 기운이 하루를 감싸요. " +
    ELEMENT_DAYLINE[element];

  const tags = document.getElementById("today-tags");
  tags.textContent = "";
  ELEMENT_TAGS[element].forEach(function (word) {
    tags.appendChild(el("span", null, word));
  });
}

function renderTodayFortune(result) {
  const info = todayPillar();
  const today = info.day;
  const relation = relationOf(result.pillars.day.stemElement, today.stemElement);
  const data = DAY_RELATION[relation];

  document.getElementById("today-fortune-date").textContent =
    formatDateKo(info.date) + " · " + today.label + "일";

  document.getElementById("today-fortune-title").textContent = data.name;
  document.getElementById("today-fortune-summary").textContent =
    ELEMENTS[result.pillars.day.stemElement].ko + " 일간인 나에게 오늘은 " + relation + "의 기운이 들어와요. " + data.summary;

  const list = document.getElementById("today-fortune-list");
  list.textContent = "";
  data.guidance.forEach(function (line) {
    list.appendChild(el("li", null, line));
  });

  document.getElementById("today-fortune-caveat").textContent =
    "오늘의 운세는 하루의 리듬을 가볍게 점검하는 참고용 해석이에요. 결정을 대신하지 않습니다.";
}

/* ---------- 궁합 ---------- */

const BRANCH_HE = [["자", "축"], ["인", "해"], ["묘", "술"], ["진", "유"], ["사", "신"], ["오", "미"]];
const BRANCH_CHUNG = [["자", "오"], ["축", "미"], ["인", "신"], ["묘", "유"], ["진", "술"], ["사", "해"]];
const BRANCH_SAMHE = [["신", "자", "진"], ["인", "오", "술"], ["사", "유", "축"], ["해", "묘", "미"]];

const COUPLE_RELATION = {
  비겁: {
    title: "친구처럼 편한 사이",
    text: "같은 오행이라 설명하지 않아도 통하는 게 많아요. 대신 서로 비슷해서 새로운 자극은 적을 수 있어요."
  },
  식상: {
    title: "내가 상대를 채워주는 사이",
    text: "내 기운이 상대에게 흘러가는 구조예요. 베푸는 게 익숙한 만큼, 받는 연습도 함께 필요해요."
  },
  재성: {
    title: "한쪽이 방향을 잡아주는 사이",
    text: "현실 감각이 좋아 함께하면 생활이 정돈돼요. 다만 이끄는 쪽이 지치지 않게 속도를 맞춰야 해요."
  },
  관성: {
    title: "상대가 나를 이끄는 사이",
    text: "배울 점이 많은 인연이에요. 다만 규칙이 많아지면 숨이 막힐 수 있으니 여백을 남겨두세요."
  },
  인성: {
    title: "상대가 나를 채워주는 사이",
    text: "기대고 싶어지는 편안함이 있어요. 고마움을 말로 표현하면 관계가 훨씬 오래갑니다."
  }
};

const GRADE = [
  { min: 80, text: "아주 잘 맞는 편이에요 ✦" },
  { min: 65, text: "잘 맞는 편이에요" },
  { min: 50, text: "무난하게 맞춰가는 편이에요" },
  { min: 0, text: "조금씩 맞춰가는 편이에요" }
];

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function pairMatch(list, a, b) {
  return list.some(function (pair) {
    return (pair[0] === a && pair[1] === b) || (pair[0] === b && pair[1] === a);
  });
}

function branchBond(a, b) {
  if (pairMatch(BRANCH_HE, a, b)) {
    return { label: "육합", delta: 8, text: "서로를 끌어당기는 육합의 짝이에요. 함께 있으면 자연스럽게 가까워져요." };
  }
  if (BRANCH_SAMHE.some(function (group) {
    return group.indexOf(a) >= 0 && group.indexOf(b) >= 0 && a !== b;
  })) {
    return { label: "삼합", delta: 6, text: "같은 방향을 바라보는 삼합의 짝이에요. 취향과 목표가 잘 겹쳐요." };
  }
  if (pairMatch(BRANCH_CHUNG, a, b)) {
    return { label: "충", delta: -8, text: "부딪히는 충의 짝이에요. 말의 온도만 낮추면 오히려 좋은 자극이 돼요." };
  }
  return { label: "담백", delta: 0, text: "특별히 얽히지도 부딪히지도 않는 담백한 짝이에요." };
}

function uniqueList(list) {
  return list.filter(function (item, index) {
    return list.indexOf(item) === index;
  });
}

function compatibilityOf(first, second) {
  const shared = ELEMENT_CYCLE.filter(function (element) {
    return first.dominant.indexOf(element) >= 0 && second.dominant.indexOf(element) >= 0;
  });
  const fillFirst = ELEMENT_CYCLE.filter(function (element) {
    return first.weak.indexOf(element) >= 0 && second.dominant.indexOf(element) >= 0;
  });
  const fillSecond = ELEMENT_CYCLE.filter(function (element) {
    return second.weak.indexOf(element) >= 0 && first.dominant.indexOf(element) >= 0;
  });
  const complementary = uniqueList(fillFirst.concat(fillSecond));

  const sameDay = first.pillars.day.stemElement === second.pillars.day.stemElement;
  const bond = branchBond(first.pillars.day.branch, second.pillars.day.branch);
  const relation = relationOf(first.pillars.day.stemElement, second.pillars.day.stemElement);
  const relationDelta = relation === "비겁" ? 0 : relation === "관성" ? -2 : 6;

  const score = clampNumber(
    50 + shared.length * 8 + complementary.length * 10 + (sameDay ? 8 : 0) + bond.delta + relationDelta,
    12,
    98
  );

  return {
    shared: shared,
    fillFirst: fillFirst,
    fillSecond: fillSecond,
    complementary: complementary,
    sameDay: sameDay,
    bond: bond,
    relation: relation,
    score: score
  };
}

function gradeOf(score) {
  for (let i = 0; i < GRADE.length; i += 1) {
    if (score >= GRADE[i].min) return GRADE[i].text;
  }
  return GRADE[GRADE.length - 1].text;
}

function addAspect(list, title, text) {
  const item = el("li");
  const icon = el("span", "aspects__icon", "✦");
  icon.setAttribute("aria-hidden", "true");
  const body = el("div", "aspects__body");
  body.appendChild(el("strong", null, title));
  body.appendChild(el("span", null, text));
  item.appendChild(icon);
  item.appendChild(body);
  list.appendChild(item);
}

function coupleCard(person, result, fallbackName) {
  const card = el("article", "couple__person");
  card.appendChild(el("h3", "couple__name", person.name || fallbackName));
  card.appendChild(
    el(
      "p",
      "couple__meta",
      ELEMENTS[result.pillars.day.stemElement].ko + " 일간 · " + (person.gender === "male" ? "남성" : "여성")
    )
  );

  const wrap = el("div", "couple__pillars");
  ["year", "month", "day", "hour"].forEach(function (key) {
    const pillar = result.pillars[key];
    const chip = el("span", "couple__pillar", pillar ? pillar.label : "—");
    if (pillar) chip.appendChild(el("small", null, pillar.hanja));
    wrap.appendChild(chip);
  });
  card.appendChild(wrap);

  return card;
}

function renderCompatibility(first, second) {
  const a = analyze(first.birth, first.timeUnknown);
  const b = analyze(second.birth, second.timeUnknown);
  const info = compatibilityOf(a, b);
  const nameA = first.name || "첫 번째 사람";
  const nameB = second.name || "상대방";

  const couple = document.getElementById("couple");
  couple.textContent = "";
  couple.appendChild(coupleCard(first, a, "첫 번째 사람"));
  const heart = el("div", "couple__heart", "✦");
  heart.setAttribute("aria-hidden", "true");
  couple.appendChild(heart);
  couple.appendChild(coupleCard(second, b, "상대방"));

  const ring = document.getElementById("score-ring");
  const num = document.getElementById("score-num");
  ring.style.setProperty("--p", 0);
  num.textContent = "0";
  window.setTimeout(function () {
    ring.style.setProperty("--p", info.score);
    num.textContent = String(info.score);
  }, 160);

  document.getElementById("score-grade").textContent = gradeOf(info.score);

  const aspects = document.getElementById("compat-aspects");
  aspects.textContent = "";

  const relation = COUPLE_RELATION[info.relation];
  addAspect(aspects, relation.title, relation.text);

  addAspect(
    aspects,
    info.shared.length ? "닮은 기운 " + fmt.list(info.shared) : "겹치는 기운이 적은 편",
    info.shared.length
      ? "설명하지 않아도 통하는 부분이 있어요. 편한 만큼 서로 물러서는 연습이 필요해요."
      : "서로 다른 결이 많아요. 그만큼 대화가 관계의 연료가 됩니다."
  );

  addAspect(
    aspects,
    info.complementary.length ? "서로 채워주는 기운 " + fmt.list(info.complementary) : "서로의 빈 곳을 채워주지 않는 조합",
    info.complementary.length
      ? (info.fillFirst.length ? nameB + "님이 " + nameA + "님의 빈 곳(" + fmt.list(info.fillFirst) + ")을 채워줘요. " : "") +
        (info.fillSecond.length ? nameA + "님이 " + nameB + "님의 빈 곳(" + fmt.list(info.fillSecond) + ")을 채워줘요." : "")
      : "각자 부족한 곳을 스스로 돌보면 관계가 한결 편안해져요."
  );

  addAspect(
    aspects,
    info.bond.label === "담백" ? "담백한 지지 관계" : info.bond.label + "의 지지 관계",
    info.bond.text
  );

  const dayA = ELEMENTS[a.pillars.day.stemElement];
  const dayB = ELEMENTS[b.pillars.day.stemElement];

  document.getElementById("compat-sub").textContent =
    dayA.ko + " 일간과 " + dayB.ko + " 일간, 두 사람의 기운이 만나는 지점을 봤어요.";
  document.getElementById("compat-title").textContent =
    nameA + " · " + nameB + "의 궁합은 " + info.score + "점";
  document.getElementById("compat-summary").textContent =
    relation.title + "예요. " + relation.text + " " +
    (info.shared.length
      ? "닮은 기운이 있어 처음부터 편안함이 느껴지는 조합이에요."
      : "닮은 기운은 적지만, 서로 다른 결이 관계를 넓혀줘요.");

  const guidance = document.getElementById("compat-guidance");
  guidance.textContent = "";
  [
    info.bond.delta < 0
      ? "부딪히는 순간에는 결론을 미루고, 다음 날 다시 이야기해 보세요."
      : "좋은 흐름일 때 고마움을 자주 말해두면 관계가 단단해져요.",
    info.complementary.length
      ? "서로 채워주는 기운을 살려, 잘하는 쪽이 자연스럽게 맡아주세요."
      : "같이 부족한 부분은 역할을 나눠서 채워보세요.",
    "중요한 결정은 감정이 가라앉은 뒤에 이야기하면 훨씬 부드러워져요."
  ].forEach(function (line) {
    guidance.appendChild(el("li", null, line));
  });

  const tip = document.getElementById("compat-tip");
  tip.textContent = "";
  tip.appendChild(el("strong", null, "별빛 한마디"));
  tip.appendChild(
    document.createTextNode(
      "궁합 점수는 두 사람의 기운이 얼마나 자연스럽게 흐르는지를 본 값이에요. 낮다고 관계가 나쁜 게 아니라, 맞춰가는 방식이 다르다는 뜻이에요."
    )
  );

  document.getElementById("compat-caveat").textContent =
    "궁합 풀이는 관계를 재미있게 돌아보는 참고 자료이며, 이별이나 결혼을 결정하지 않습니다.";
}

/* ---------- 이벤트 ---------- */

function initYearSelect() {
  const select = document.getElementById("target-year");
  const now = new Date().getFullYear();
  for (let i = 0; i < 6; i += 1) {
    const year = now + i;
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = year + "년" + (i === 0 ? " (올해)" : "");
    select.appendChild(option);
  }
  document.getElementById("year-now").textContent = String(now);
}

function initTimeUnknown() {
  bindTimeUnknown("time-unknown", "birthtime");
  bindTimeUnknown("time-unknown2", "birthtime2");
}

function bindTimeUnknown(checkId, timeId) {
  const check = document.getElementById(checkId);
  const time = document.getElementById(timeId);
  if (!check || !time) return;
  check.addEventListener("change", function () {
    time.disabled = check.checked;
  });
}

function pad2(value) {
  return value < 10 ? "0" + value : String(value);
}

/* 생년월일·시간 기본값 = 오늘 / 현재 시각 */
function initDefaults() {
  const now = new Date();
  const dateStr = now.getFullYear() + "-" + pad2(now.getMonth() + 1) + "-" + pad2(now.getDate());
  const timeStr = pad2(now.getHours()) + ":" + pad2(now.getMinutes());

  ["birthdate", "birthdate2"].forEach(function (id) {
    const node = document.getElementById(id);
    if (node) node.value = dateStr;
  });
  ["birthtime", "birthtime2"].forEach(function (id) {
    const node = document.getElementById(id);
    if (node) node.value = timeStr;
  });
}

function initMode() {
  const form = document.getElementById("saju-form");
  const person2 = document.getElementById("person2");
  const soloOptions = document.getElementById("solo-options");
  const submitText = document.getElementById("submit-text");
  const group1 = document.getElementById("group1-label");

  form.addEventListener("change", function (event) {
    if (!event.target || event.target.name !== "mode") return;

    const compat = event.target.value === "compat";
    person2.hidden = !compat;
    soloOptions.hidden = compat;
    submitText.textContent = compat ? "궁합 보기" : "별에게 물어보기";
    group1.textContent = compat ? "첫 번째 사람" : "나의 정보";
  });
}

function initForm() {
  const form = document.getElementById("saju-form");
  const error = document.getElementById("form-error");
  const resultSection = document.getElementById("result");
  const compatSection = document.getElementById("compat-result");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    error.hidden = true;

    const mode = (form.querySelector('input[name="mode"]:checked') || {}).value || "solo";
    const first = readPerson(form, {
      name: "name",
      date: "birthdate",
      time: "birthtime",
      unknown: "time-unknown",
      gender: "gender"
    });

    if (!first) {
      error.textContent = "생년월일을 먼저 알려주세요.";
      error.hidden = false;
      document.getElementById("birthdate").focus();
      return;
    }

    if (mode === "compat") {
      const second = readPerson(form, {
        name: "name2",
        date: "birthdate2",
        time: "birthtime2",
        unknown: "time-unknown2",
        gender: "gender2"
      });

      if (!second) {
        error.textContent = "상대방의 생년월일도 알려주세요.";
        error.hidden = false;
        document.getElementById("birthdate2").focus();
        return;
      }

      renderCompatibility(first, second);

      resultSection.hidden = true;
      compatSection.hidden = false;
      compatSection.classList.remove("is-visible");
      void compatSection.offsetWidth;
      compatSection.classList.add("is-visible");

      window.setTimeout(function () {
        compatSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 90);
      return;
    }

    const topic = (form.querySelector('input[name="topic"]:checked') || {}).value || "general";
    const targetYear = Number(document.getElementById("target-year").value);
    const result = analyze(first.birth, first.timeUnknown);

    renderPillars(result.pillars);
    renderElements(result.counts, result.dominant, result.weak);
    renderDayMaster(result.pillars, result.strength, result.useful);
    renderFortune(result, topic, targetYear, first.timeUnknown, first.name);
    renderTodayFortune(result);

    compatSection.hidden = true;
    resultSection.hidden = false;
    resultSection.classList.remove("is-visible");
    void resultSection.offsetWidth;
    resultSection.classList.add("is-visible");

    window.setTimeout(function () {
      resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 90);
  });
}

/* 폼에서 한 사람의 정보 읽기 */
function readPerson(form, ids) {
  const dateValue = document.getElementById(ids.date).value;
  if (!dateValue) return null;

  const timeUnknown = document.getElementById(ids.unknown).checked;
  const timeValue = document.getElementById(ids.time).value || "12:00";
  const parts = dateValue.split("-").map(Number);
  const times = timeValue.split(":").map(Number);

  const birth = new Date(
    parts[0],
    parts[1] - 1,
    parts[2],
    timeUnknown ? 0 : times[0],
    timeUnknown ? 0 : times[1],
    0
  );

  if (isNaN(birth.getTime())) return null;

  const genderInput = form.querySelector('input[name="' + ids.gender + '"]:checked');

  return {
    name: document.getElementById(ids.name).value.trim(),
    birth: birth,
    timeUnknown: timeUnknown,
    gender: genderInput ? genderInput.value : "female"
  };
}

document.addEventListener("DOMContentLoaded", function () {
  initYearSelect();
  initTimeUnknown();
  initDefaults();
  initMode();
  initForm();
  renderToday();
});
