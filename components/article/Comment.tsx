import { db } from 'fb';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import dateNumtoStr from 'utils/dateNumToStr';
import { CommentType } from 'pages/article/[id]';
import style from 'styles/components/Comment.module.scss';

interface Props {
  content: string;
  writerid: string;
  date: number;
  articleid: string;
  currentUserid: string | null;
  id: string;
}

interface Writer {
  writername: string;
  writerphoto: string;
}

export default function Comment({
  id,
  content,
  writerid,
  date,
  articleid,
  currentUserid,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [writerData, setWriterData] = useState<Writer | null>(null);

  useEffect(() => {
    (async () => {
      const snapWriter = await getDoc(doc(db, 'users', writerid));
      if (!snapWriter.exists()) {
        setWriterData(null);
      } else {
        const { name: writername, photo: writerphoto } = snapWriter.data();
        setWriterData({ writername, writerphoto });
      }
    })();
  }, []);

  const click$delete = async () => {
    setLoading(true);
    const answer = confirm('해당 댓글을 삭제하시겠습니까?');
    if (!answer) {
      return;
    }
    try {
      const snapshotArticle = await getDoc(doc(db, 'articles', articleid));
      if (snapshotArticle.exists()) {
        const { comments } = snapshotArticle.data();
        const newComments = comments.filter((comment: CommentType) => comment.id !== id);
        await updateDoc(doc(db, 'articles', articleid), {
          comments: newComments,
        });
        location.reload();
      }
    } catch (error) {
      console.error(error);
      alert('삭제가 되지 않았습니다!');
    }
    setLoading(false);
  };

  if (!writerData) {
    return <></>;
  }

  return (
    <article className={style['comment']}>
      <div className={style['meta']}>
        <div className={style['writer-photo']}>
          <img src={writerData.writerphoto} />
        </div>
        <div className={style['writer-name']}>{writerData.writername}</div>
        <div>{dateNumtoStr(date)}</div>
      </div>
      <div>{content}</div>
      {writerid === currentUserid && (
        <div className={style['delete']}>
          <button onClick={click$delete} disabled={loading}>
            삭제
          </button>
        </div>
      )}
    </article>
  );
}