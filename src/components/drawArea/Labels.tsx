import { useLabel } from '../../hooks/useLabel';
import Label from './Labels/Label';

const Labels: React.FC = () => {
  const { labelArray, previewLabel } = useLabel();

  return (
    <svg>
      {labelArray.map(({ label, key, onClick, point }) => (
        <svg onClick={onClick} key={key}>
          <Label point={point} label={label} />
        </svg>
      ))}
      {previewLabel && <Label point={previewLabel.point} label={previewLabel.label} />}
    </svg>
  );
};

export default Labels;
