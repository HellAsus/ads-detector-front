type Props = {
  transcript: string;
};

export default function TranscriptionItem({ transcript }: Props) {
  return <div className="border-b-1">{transcript}</div>;
}
