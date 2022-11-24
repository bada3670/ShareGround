import { auth, db } from 'fb';
import { deleteUser } from 'firebase/auth';
import { doc, deleteDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import authReducer, { AuthState } from 'reducers/auth';
import { LoadStatus } from 'components/profile/Account';
import style from 'styles/components/AccountDelete.module.scss';

export default function AccountDelete({ loadStatus }: { loadStatus: LoadStatus }) {
  const { loading, setLoading } = loadStatus;
  const router = useRouter();
  const { id: userid } = useSelector((state: AuthState) => state.auth);
  const dispatch = useDispatch();

  const click$delete = async () => {
    const answer = confirm('정말로 탈퇴하시겠습니까? 작성된 글들도 다 삭제됩니다.');
    if (!answer) {
      return;
    }
    if (!userid) {
      alert('현재 사용자가 없습니다.');
      return;
    }
    setLoading(true);
    try {
      if (auth.currentUser) {
        // 계정 삭제
        await deleteUser(auth.currentUser);
        // firestore에서 계정 삭제
        deleteDoc(doc(db, 'users', userid));
        // 올린 글 삭제
        const queryMade = query(
          collection(db, 'articles'),
          where('userid', '==', userid)
        );
        const snapshot = await getDocs(queryMade);
        snapshot.docs.forEach(async ({ id }) => {
          deleteDoc(doc(db, 'articles', id));
        });
        // redux
        dispatch(
          authReducer.actions.changeAll({
            status: 'failed',
            id: null,
            name: null,
            photo: null,
          })
        );
      }
      router.push('/');
    } catch (error) {
      console.error(error);
      alert('죄송합니다. 처리가 되지 않은 부분이 있습니다.');
      setLoading(false);
    }
  };

  return (
    <section className={style['section']}>
      <button onClick={click$delete} disabled={loading} className={style['button']}>
        탈퇴
      </button>
    </section>
  );
}