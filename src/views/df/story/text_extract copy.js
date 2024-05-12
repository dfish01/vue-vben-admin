
export function parseStoryData(data) {
  const lines = data.split('\n');
  let title = '';
  let storyRoleList = [];
  let background = '';
  let storyChapterList = [];
  let currentRole = null;
  let currentChapter = null;

  for (let line of lines) {
    line = line.trim();

    if (line.startsWith('标题:')) {
      title = line.replace('标题:', '');
    } else if (line.startsWith('角色名:')) {
      if (currentRole) {
        storyRoleList.push(currentRole);
      }
      currentRole = { roleName: '', description: '' };
      currentRole.roleName = line.replace('角色名:', '').trim();
    } else if (line.startsWith('角色描述:')) {
      currentRole.description = line.replace('角色描述:', '').trim();
    } else if (line.startsWith('背景:')) {
      background = line.replace('背景:', '').trim();
    } else if (line.startsWith('>>章节')) {
      if (currentChapter) {
        storyChapterList.push(currentChapter);
      }
      currentChapter = { title: '', description: '', storyPictureList:[],};
      currentChapter.title = line.replace('>>', '').trim();
    } else if (line.startsWith('画面描述:')) {
      currentChapter.description = line.replace('画面描述:', '').trim();
    }
  }

  if (currentRole) {
    storyRoleList.push(currentRole);
  }
  if (currentChapter) {
    storyChapterList.push(currentChapter);
  }

  return {
    title,
    storyRoleList,
    background,
    storyChapterList,
  };
}


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





