
export function extractAndTransformText(text) {
  // 提取标题
  const titleMatch = text.match(/^标题：\s*(.*?)\n/);
  const title = titleMatch ? (titleMatch[1] ? titleMatch[1] : titleMatch[0]) : '';
  console.log(111);
  // 提取角色信息
  const roleRegex = /角色名：\s*(.*?)\n\s*角色描述：\s*(.*?)\n/gs;
  const roles = [];
  let roleMatch;
  while ((roleMatch = roleRegex.exec(text))) {
    roles.push({
      roleName: roleMatch[1],
      description: roleMatch[2].trim(),
    });
  }

  // 提取背景
  const backgroundMatch = text.match(/背景：\n(.*?)\n/gs);
  const background = backgroundMatch ? (backgroundMatch[1] ? backgroundMatch[1].trim() : backgroundMatch[0].trim()) : '';

  // 提取章节信息
  const chapterRegex = /章节(一|二|三|四|五)：\s*(.*?)\n\s*画面描述：\s*(.*?)\n/gs;
  const chapters = [];
  let chapterMatch;
  while ((chapterMatch = chapterRegex.exec(text))) {
    chapters.push({
      title: `${chapterMatch[2]}`,
      description: chapterMatch[3].trim(),
      storyPictureList:[],
    });
  }
 
  // 构造最终JSON对象
  const result = {
    title,
    genType: 'AI',
    storyRoleList: roles,
    background,
    storyChapterList: chapters,
  };

  // 返回JSON格式的字符串
  return result;
}




