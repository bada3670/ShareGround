import { db } from 'fb';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import type { NextApiRequest as Req, NextApiResponse as Res } from 'next';
import { CommentType } from 'pages/article/[id]';
import { v4 as uuidv4 } from 'uuid';

// 자주 쓰이는 메시지들
const mesBadRequest = '적절하지 않은 요청입니다.';
const mesServerError = '죄송합니다. 서버에서 에러가 발생했습니다.';

async function handlePost(req: Req, res: Res) {
  const { article } = req.query;
  if (typeof article !== 'string') {
    res.status(400).json({ message: mesBadRequest });
    return;
  }
  const { content, writerid } = req.body;
  const docRef = doc(db, 'articles', article);
  const newComment = { id: uuidv4(), content, writerid, date: Date.now() };
  const snapArticle = await getDoc(docRef);
  if (!snapArticle.exists()) {
    res.status(404).json({ message: '해당 글이 존재하지 않습니다.' });
    return;
  }
  const { comments } = snapArticle.data();
  comments.unshift(newComment);
  await updateDoc(docRef, { comments });
  res.status(204).json({ message: '추가되었습니다.' });
}

async function handleDelete(req: Req, res: Res) {
  const { article, comment } = req.query;
  if (typeof article !== 'string' || typeof comment !== 'string') {
    res.status(400).json({ message: mesBadRequest });
    return;
  }
  const docRef = doc(db, 'articles', article);
  const snapArticle = await getDoc(docRef);
  if (!snapArticle.exists()) {
    res.status(404).json({ message: '해당 글이 존재하지 않습니다.' });
    return;
  }
  const { comments: prevComments } = snapArticle.data();
  const newComments = prevComments.filter(
    (prevComment: CommentType) => prevComment.id !== comment
  );
  await updateDoc(docRef, {
    comments: newComments,
  });
  res.status(204).json({ message: '삭제되었습니다.' });
}

//////////////////////////////////////////////////////

export default async function (req: Req, res: Res) {
  if (req.method === 'POST') {
    try {
      await handlePost(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: mesServerError });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await handleDelete(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: mesServerError });
    }
  }
}
