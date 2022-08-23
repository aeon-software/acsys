import { Grid } from '@mui/material';

export default function AutoGen(props) {
  if (props.new) {
    return (
      <Grid item xs={props.width}>
        <h3 className="element-header">{props.field_name.toUpperCase()}</h3>
        <input
          className="custom-input"
          placeholder="Value is auto generated"
          value="Value is autogenerated"
          readOnly
          type="text"
          style={{ width: '100%' }}
        />
      </Grid>
    );
  }

  return (
    <Grid item xs={props.width}>
      <h3 className="element-header">{props.field_name.toUpperCase()}</h3>
      <input
        className="custom-input"
        placeholder="Enter value here"
        defaultValue={props.defaultValue}
        readOnly
        type="text"
        style={{ width: '100%' }}
      />
    </Grid>
  );
}
