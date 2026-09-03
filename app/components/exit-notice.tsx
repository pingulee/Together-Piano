import { ButtonLink } from '@/app/components/ui/button';
import { Panel } from '@/app/components/ui/panel';

/** 강퇴·잠금 등으로 방에 있을 수 없게 됐을 때 */
export default function ExitNotice({ reason }: { reason: string }) {
  return (
    <section className='stage-light flex flex-1 items-center justify-center px-6'>
      <Panel
        padding='lg'
        className='flex max-w-xs flex-col items-center gap-4 text-center'
      >
        <p className='text-sm font-semibold'>{reason}</p>
        <ButtonLink href='/piano' variant='primary' size='sm'>
          방 목록으로
        </ButtonLink>
      </Panel>
    </section>
  );
}
