//前端数据交互格式
export const buildFeedbackNote = (feedbackArr) => {
  let feedbackHeadInfos = []
  feedbackArr.forEach((item) => {
    let feedbackHeadInfo = {
      title: item.name,
      contents: item.items.join(','),
    }
  })
}

export const feedbackHeadInfosX = [
  {
    name: '职业',
    items: [
      '经商',
      '从政',
      '教师',
      '职工',
      '农民',
      '医生',
      '设计师',
      '军警',
      '律师',
      '销售',
      '未知',
    ],
    data: '',
    show: 1,
    type: 1,
  },
  {
    name: '学历',
    items: ['初中', '高中', '专科', '本科', '研究生', '博士'],
  },
  {
    name: '财富',
    items: [
      '20万以下',
      '20-100万',
      '100-1000万',
      '1000-5000万',
      '5000-10000万',
      '1亿以上',
      '负债',
      '未知',
    ],
    data: '',
    show: 1,
    type: 1,
  },
  {
    name: '婚姻',
    items: ['未婚', '已婚', '二婚', '离异', '丧偶', '同性恋', '未知'],
    data: '',
    show: 1,
    type: 1,
  },
]

export const feedbackBodyInfosX = [
  {
    name: '健康状态',
    items: '',
    type: 0,
    data: '', //用户输入的数据
    show: 1,
  },
  {
    name: '六亲状态',
    items: '',
    type: 0,
    data: '', //用户输入的数据
    show: 1,
  },
  {
    name: '性情描述',
    items: '',
    type: 0,
    data: '', //用户输入的数据
    show: 1,
  },
]

export const feedbackFootInfo1X = {
  title: '大运',
  items: [
    // '2027年 乙亥大运',
    // '2028年 丙子大运',
    // '2029年 丁丑大运',
    // '2030年 戊寅大运',
    // '2031年 己卯大运',
    // '2032年 庚辰大运',
    // '2033年 辛巳大运',
    // '2034年 壬午大运',
    // '2035年 癸未大运',
    // '2036年 甲申大运',
    // '2037年 乙酉大运',
    // '2038年 丙戌大运',
    // '2039年 丁亥大运',
    // '2040年 戊子大运',
    // '2041年 己丑大运',
    // '2042年 庚寅大运',
    // '2043年 辛卯大运',
    // '2044年 壬辰大运',
    // '2045年 癸巳大运',
    // '2046年 甲午大运',
    // '2047年 乙未大运',
    // '2048年 丙申大运',
    // '2049年 丁酉大运',
    // '2050年 戊戌大运',
    // '2051年 己亥大运',
    // '2052年 庚子大运',
    // '2053年 辛丑大运',
    // '2054年 壬寅大运',
  ],
  contents: [
    // {
    //   name: '2029年 巳酉',
    //   data: '事迹记录',
    //   jxDex: -1,
    //   tag: 0, //识别流年，以此作为绑定的标识（适配后端接口，与前端交互不匹配的问题）
    // },
  ],
}

export const feedbackFootInfo2X = {
  title: '流年',
  items: [
    // '2027年 乙亥大运',
    // '2028年 丙子大运',
    // '2029年 丁丑大运',
    // '2030年 戊寅大运',
    // '2031年 己卯大运',
    // '2032年 庚辰大运',
    // '2033年 辛巳大运',
    // '2034年 壬午大运',
    // '2035年 癸未大运',
    // '2036年 甲申大运',
    // '2037年 乙酉大运',
    // '2038年 丙戌大运',
    // '2039年 丁亥大运',
    // '2040年 戊子大运',
    // '2041年 己丑大运',
    // '2042年 庚寅大运',
    // '2043年 辛卯大运',
    // '2044年 壬辰大运',
    // '2045年 癸巳大运',
    // '2046年 甲午大运',
    // '2047年 乙未大运',
    // '2048年 丙申大运',
    // '2049年 丁酉大运',
    // '2050年 戊戌大运',
    // '2051年 己亥大运',
    // '2052年 庚子大运',
    // '2053年 辛丑大运',
    // '2054年 壬寅大运',
  ], //流年年份列表
  contents: [
    // {
    //   name: '2029年 巳酉',
    //   data: '事迹记录',
    //   jxDex: -1,
    //   tag: 0, //识别流年，以此作为绑定的标识（适配后端接口，与前端交互不匹配的问题）
    // },
  ],
}

export const feedbackFootInfosX = [feedbackFootInfo1X, feedbackFootInfo2X]

export const commentHeadInfosX = [
  {
    name: '旺衰',
    items: ['身旺', '偏旺', '平和', '偏弱', '身弱', '从弱', '未知', '假从弱'],
    data: '',
    show: 1,
    type: 1,
  },
  {
    name: '格局',
    items: [
      '建禄格',
      '劫财格',
      '食神格',
      '伤官格',
      '正财格',
      '偏财格',
      '正印格',
      '偏印格',
      '正宫格',
      '七杀格',
      '曲直格',
      '炎上格',
      '稼穑格',
      '从革格',
      '润下格',
      '从儿格',
      '从财格',
      '从杀格',
      '从强格',
      '从弱格',
      '测试格',
    ],
    data: '',
    show: 1,
    type: 1,
  },
]

export const commentBodyInfosX = [
  {
    name: '总结',
    content: '',
  },
]

export const structModels = {
  feedbackFootInfos: [
    { title: '大运', items: [], contents: [] },
    { title: '流年', items: [], contents: [] },
  ],
  feedbackBodyInfos: [
    {
      data: '',
      items: '',
      name: '健康状态',
      show: 1,
      type: 0,
    },
    {
      data: '',
      items: '',
      name: '六亲状况',
      show: 1,
      type: 0,
    },
    {
      data: '',
      items: '',
      name: '性情描述',
      show: 1,
      type: 0,
    },
  ],
  feedbackHeadInfos: [
    {
      data: '',
      items: '经商,从政,教师,职工,农民,中专,环保',
      name: '职业',
      show: 1,
      type: 1,
    },
    {
      data: '',
      items: '小学,初中,高中,专科,本科,研究生,博士',
      name: '学历',
      show: 1,
      type: 1,
    },
    {
      data: '',
      items: '20万以下,20-100万,100-1000万,1000-5000万,5000-10000万,1亿以上',
      name: '财富',
      show: 1,
      type: 1,
    },
    {
      data: '',
      items: '未婚,已婚,二婚,三婚,离异,丧偶',
      name: '婚姻',
      show: 1,
      type: 1,
    },
  ],
  commentHeadInfos: [
    {
      data: '',
      items: '身旺,偏旺,平和,偏弱,身弱,从强,从弱,未知',
      name: '旺弱',
      show: 1,
      type: 1,
    },
    {
      data: '',
      items:
        '建禄格,劫财格,食神格,伤官格,正财格,偏财格,正印格,偏印格,正官格,七杀格',
      name: '格局',
      show: 1,
      type: 1,
    },
    {
      data: '',
      items:
        '建禄格,劫财格,食神格,伤官格,正财格,偏财格,正印格,偏印格,正官格,七杀格',
      name: '格局',
      show: 1,
      type: 1,
    },
    {
      data: '',
      items:
        '建禄格,劫财格,食神格,伤官格,正财格,偏财格,正印格,偏印格,正官格,七杀格',
      name: '格局',
      show: 1,
      type: 1,
    },
    {
      data: '',
      items: '木,火,土,金,水',
      name: '喜',
      show: 1,
      type: 1,
    },
    {
      data: '',
      items: '木,火,土,金,水',
      name: '喜',
      show: 1,
      type: 1,
    },
    {
      data: '',
      items: '木,火,土,金,水',
      name: '喜',
      show: 1,
      type: 1,
    },
    {
      data: '',
      items: '木,火,土,金,水',
      name: '忌',
      show: 1,
      type: 1,
    },
    {
      data: '',
      items: '木,火,土,金,水',
      name: '忌',
      show: 1,
      type: 1,
    },
    {
      data: '',
      items: '木,火,土,金,水',
      name: '忌',
      show: 1,
      type: 1,
    },
  ],
  commentBodyInfos: [{ name: '总结', data: '' }],
}
