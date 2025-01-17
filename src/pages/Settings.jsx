import {
  Box,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  NativeSelect,
  Tooltip,
} from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { KeyboardArrowDown } from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import * as Acsys from '../utils/Acsys/Acsys';
import { AcsysContext } from '../utils/Session/AcsysProvider';
import LoadingDialog from '../components/Dialogs/LoadingDialog';
import MessageDialog from '../components/Dialogs/MessageDialog';
import YesNoDialog from '../components/Dialogs/YesNoDialog';
import { useNavigate } from 'react-router-dom';

const Settings = (props) => {
  const context = useContext(AcsysContext);
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [socketPath, setSocketPath] = useState('');
  const [dhost, setDhost] = useState('');
  const [dport, setDport] = useState('');
  const [ddatabase, setDatabase] = useState('');
  const [dusername, setDusername] = useState('');
  const [dpassword, setDpassword] = useState('');
  const [project_name, setProjectName] = useState('');
  const [databaseType, setDatabaseType] = useState('');
  const [type, setType] = useState('');
  const [project_id, setProjectId] = useState('');
  const [private_key_id, setPrivateKeyId] = useState('');
  const [private_key, setPrivateKey] = useState('');
  const [client_email, setClientEmail] = useState('');
  const [client_id, setClientId] = useState('');
  const [auth_uri, setAuthUri] = useState('');
  const [token_uri, setTokenUri] = useState('');
  const [auth_provider_x509_cert_url, setAuthProviderX509CertUrl] =
    useState('');
  const [client_x509_cert_url, setClientX509CertUrl] = useState('');
  const [bucket, setBucket] = useState('');
  const [buckets, setBuckets] = useState([]);
  const [updateBucket, setUpdateBucket] = useState(false);
  const [updateEmail, setUpdateEmail] = useState(false);
  const [updateDatabase, setUpdateDatabase] = useState(false);
  const [updateStorage, setUpdateStorage] = useState(false);
  const [uploadFile, setUploadFile] = useState();
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);
  const [isStateless, setIsStateless] = useState('');
  const navigate = useNavigate();

  const handleClickOpen = () => {
    if (updateDatabase || updateStorage || updateEmail || updateBucket) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMessageClose = () => {
    setMessageOpen(false);
  };

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    context.setHeader('Settings');
    const isStateless = await Acsys.isStateless();
    const emailConfig = await Acsys.getEmailConfig();
    if (emailConfig.length > 0) {
      setHost(emailConfig[0].host);
      setPort(emailConfig[0].port);
      setUsername(emailConfig[0].username);
      setPassword(emailConfig[0].password);
    }
    const databaseType = await Acsys.getDatabaseType();
    if (!isStateless) {
      const databaseConfig = await Acsys.getDatabaseConfig();
      if (databaseType === 'local') {
        setProjectName(databaseConfig.project_name);
      } else if (databaseType === 'firestore') {
        const currentBucket = await Acsys.getCurrentBucket();
        const buckets = await Acsys.getStorageBuckets();

        setBucket(currentBucket);
        setBuckets(buckets);
        setType(databaseConfig.type);
        setProjectId(databaseConfig.project_id);
        setPrivateKeyId(databaseConfig.private_key_id);
        setPrivateKey(databaseConfig.private_key);
        setClientEmail(databaseConfig.client_email);
        setClientId(databaseConfig.client_id);
        setAuthUri(databaseConfig.auth_uri);
        setTokenUri(databaseConfig.token_uri);
        setAuthProviderX509CertUrl(databaseConfig.auth_provider_x509_cert_url);
        setClientX509CertUrl(databaseConfig.client_x509_cert_url);
      } else if (databaseType === 'mysql') {
        const currentBucket = await Acsys.getCurrentBucket();
        const buckets = await Acsys.getStorageBuckets();
        setBucket(currentBucket);
        setBuckets(buckets);
        setType(databaseConfig.type);
        setProjectId(databaseConfig.project_id);
        setPrivateKeyId(databaseConfig.private_key_id);
        setPrivateKey(databaseConfig.private_key);
        setClientEmail(databaseConfig.client_email);
        setClientId(databaseConfig.client_id);
        setAuthUri(databaseConfig.auth_uri);
        setTokenUri(databaseConfig.token_uri);
        setAuthProviderX509CertUrl(databaseConfig.auth_provider_x509_cert_url);
        setClientX509CertUrl(databaseConfig.client_x509_cert_url);
      }
    }
    setIsStateless(isStateless);
    setDatabaseType(databaseType);
  };

  const setEmail = async () => {
    const config = {
      host: host,
      port: port,
      username: username,
      password: password,
    };
    await Acsys.setEmailConfig(config);
  };

  const set_bucket = async () => {
    const config = {
      bucket: bucket,
    };
    await Acsys.setStorageBucket(config);
  };

  const handlesetDatabase = async () => {
    if (databaseType === 'firestore') {
      if (uploadFile === undefined) {
        setMessageOpen(true);
        setOpen(false);
        setMessage('Please select a configuration to upload.');
        setLoading(false);
      } else {
        await Acsys.setFirestoreConfig(uploadFile);
      }
    } else if (databaseType === 'mysql') {
      if (
        dhost < 1 ||
        ddatabase < 1 ||
        dusername < 1 ||
        dpassword < 1 ||
        uploadFile === undefined
      ) {
        setMessageOpen(true);
        setOpen(false);
        setMessage(
          'Please complete all necessary database fields and storage settings.'
        );
        setLoading(false);
      } else {
        await Acsys.setMysqlConfig(
          dhost,
          dport,
          ddatabase,
          dusername,
          dpassword,
          socketPath,
          uploadFile
        );
      }
    } else if (databaseType === 'local') {
      if (project_name.length < 1) {
        setMessageOpen(true);
        setOpen(false);
        setMessage('Please enter a project name.');
        setLoading(false);
      } else {
        await Acsys.setLocalDatabaseConfig(project_name);
      }
    }
  };

  const setConfig = async () => {
    setOpen(false);
    setLoading(false);
    if (updateEmail) {
      setEmail();
      await sleep(5000);
    }
    if (updateBucket) {
      set_bucket();
      await sleep(5000);
    }
    if (updateDatabase || updateStorage) {
      handlesetDatabase();
      await sleep(5000);
    }
    if ((updateDatabase || updateEmail || updateStorage) && loading) {
      await sleep(7500);
      navigate(0);
    }
    setLoading(false);
  };

  const setRef = (ref) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => loadFields(event);
    try {
      fileReader.readAsText(ref.target.files[0]);
    } catch (error) {}
    setFileName(ref.target.files[0].name), setUploadFile(ref.target.files[0]);
  };

  const loadFields = (event) => {
    try {
      const settings = JSON.parse(event.target.result);
      setType(settings.type);
      setProjectId(ettings.project_id);
      setPrivateKeyId(settings.private_key_id);
      setPrivateKey(settings.private_key);
      setClientEmail(settings.client_email);
      setClientId(settings.client_id);
      setAuthUri(settings.auth_uri);
      setTokenUri(settings.token_uri);
      setAuthProviderX509CertUrl(settings.auth_provider_x509_cert_url);
      setClientX509CertUrl(settings.client_x509_cert_url);
    } catch (error) {}
  };

  const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };

  const onChange = (event) => {
    // setState({ [event.target.name]: event.target.value });
  };

  const getBucketPanel = () => {
    console.log('buckerts', buckets);
    return (
      <Accordion
        style={{ clear: 'both' }}
        onChange={(e) => setUpdateBucket(!updateBucket)}
      >
        <AccordionSummary
          expandIcon={<KeyboardArrowDown />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Bucket Configuration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            margin="auto"
            width="90%"
            display="flex"
            flexDirection="column"
            textAlign="center"
            padding="16px"
          >
            <NativeSelect
              value={bucket}
              onChange={(e) => setBucket(e.target.value)}
              style={{ width: '100%', paddingTop: 7 }}
            >
              {buckets.map((bucketName) => (
                <option value={bucketName}>{bucketName}</option>
              ))}
            </NativeSelect>
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  };

  const getLocalPanel = () => {
    return (
      <Accordion
        style={{ clear: 'both' }}
        onChange={(e) => setUpdateDatabase(!updateDatabase)}
      >
        <AccordionSummary
          expandIcon={<KeyboardArrowDown />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Local Configuration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            margin="auto"
            width="90%"
            display="flex"
            flexDirection="column"
            textAlign="center"
            padding="16px"
          >
            <input
              id="project_name"
              name="project_name"
              placeholder="Project Name"
              value={project_name}
              onChange={(e) => setProjectName(e.target.value)}
              style={{ marginTop: '20px' }}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  };

  const getFirestorePanel = (name) => {
    return (
      <Grid>
        <Grid item xs={12} style={{ marginBottom: 30 }}>
          {bucket.length > 0 ? getBucketPanel() : null}
        </Grid>
        <Grid item xs={12}>
          <Accordion
            style={{ clear: 'both' }}
            onChange={(e) => setUpdateStorage(!updateStorage)}
          >
            <AccordionSummary
              expandIcon={<KeyboardArrowDown />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{name} Configuration</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                margin="auto"
                width="90%"
                display="flex"
                flexDirection="column"
                textAlign="center"
                padding="16px"
              >
                <input
                  className="custom-input"
                  id="type"
                  name="type"
                  onChange={(e) => setType(e.target.value)}
                  placeholder="Type"
                  value={type}
                  style={{ marginTop: '20px' }}
                />
                <input
                  className="custom-input"
                  id="project_id"
                  name="project_id"
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="Project ID"
                  value={project_id}
                  style={{ marginTop: '20px' }}
                />
                <input
                  className="custom-input"
                  id="private_key_id"
                  name="private_key_id"
                  onChange={(e) => setPrivateKeyId(e.target.value)}
                  placeholder="Private Key ID"
                  value={private_key_id}
                  style={{ marginTop: '20px' }}
                />
                <input
                  className="custom-input"
                  id="private_key"
                  name="private_key"
                  onChange={(e) => setPrivateKeyId(e.target.value)}
                  placeholder="Private Key"
                  value={private_key}
                  style={{ marginTop: '20px' }}
                />
                <input
                  className="custom-input"
                  id="client_email"
                  name="client_email"
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="Client Email"
                  value={client_email}
                  style={{ marginTop: '20px' }}
                />
                <input
                  className="custom-input"
                  id="client_id"
                  name="client_id"
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="Client ID"
                  value={client_id}
                  style={{ marginTop: '20px' }}
                />
                <input
                  className="custom-input"
                  id="auth_uri"
                  name="auth_uri"
                  onChange={(e) => setAuthUri(e.target.value)}
                  placeholder="Auth URI"
                  value={auth_uri}
                  style={{ marginTop: '20px' }}
                />
                <input
                  className="custom-input"
                  id="token_uri"
                  name="token_uri"
                  onChange={(e) => setTokenUri(e.target.value)}
                  placeholder="Token URI"
                  value={token_uri}
                  style={{ marginTop: '20px' }}
                />
                <input
                  className="custom-input"
                  id="auth_provider_x509_cert_url"
                  name="auth_provider_x509_cert_url"
                  onChange={(e) => setAuthProviderX509CertUrl(e.target.value)}
                  placeholder="Auth Provider x509 Cert URL"
                  value={auth_provider_x509_cert_url}
                  style={{ marginTop: '20px' }}
                />
                <input
                  className="custom-input"
                  id="client_x509_cert_url"
                  name="client_x509_cert_url"
                  onChange={(e) => setClientX509CertUrl(e.target.value)}
                  placeholder="Client x509 Cert URL"
                  value={client_x509_cert_url}
                  style={{ marginTop: '20px' }}
                />
                <Grid container style={{ marginTop: '20px' }}>
                  <Grid item xs>
                    <input defaultValue={fileName} style={{ width: '100%' }} />
                  </Grid>
                  <Grid item>
                    <input
                      id="contained-button-file"
                      type="file"
                      accept=".json"
                      style={{ display: 'none' }}
                      onChange={setRef}
                    />
                    <label htmlFor="contained-button-file">
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        style={{ marginLeft: 28, height: 32 }}
                      >
                        New Config
                      </Button>
                    </label>
                  </Grid>
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    );
  };

  const getMysqlPanel = () => {
    return (
      <Grid>
        <Grid item xs={12} style={{ marginBottom: 30 }}>
          <Accordion
            style={{ clear: 'both' }}
            onChange={(e) => setUpdateDatabase(!updateDatabase)}
          >
            <AccordionSummary
              expandIcon={<KeyboardArrowDown />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>MySQL Configuration</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                margin="auto"
                width="90%"
                display="flex"
                flexDirection="column"
                textAlign="center"
                padding="16px"
              >
                <input
                  className="custom-input"
                  id="dhost"
                  name="dhost"
                  placeholder="Host"
                  value={dhost}
                  onChange={(e) => setDhost(e.target.value)}
                  style={{ marginTop: '20px' }}
                />
                <input
                  className="custom-input"
                  id="dport"
                  name="dport"
                  placeholder="Port (Can be empty)"
                  value={dport}
                  onChange={(e) => setDport(e.target.value)}
                  type="number"
                  style={{ marginTop: '20px' }}
                />
                <input
                  className="custom-input"
                  id="ddatabase"
                  name="ddatabase"
                  placeholder="Database"
                  value={ddatabase}
                  onChange={(e) => setDatabase(e.target.value)}
                  style={{ marginTop: '20px' }}
                />
                <input
                  className="custom-input"
                  id="dusername"
                  name="dusername"
                  placeholder="Username"
                  value={dusername}
                  onChange={(e) => setDusername(e.target.value)}
                  style={{ marginTop: '20px' }}
                />
                <input
                  className="custom-input"
                  id="dpassword"
                  name="dpassword"
                  placeholder="Password"
                  value={dpassword}
                  onChange={(e) => setDpassword(e.target.value)}
                  type="password"
                  style={{ marginTop: '20px' }}
                />
                <input
                  className="custom-input"
                  id="socketPath"
                  name="socketPath"
                  placeholder="Socket Path (May be needed for production environments)"
                  value={socketPath}
                  onChange={(e) => setSocketPath(e.target.value)}
                  style={{ marginTop: '20px' }}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12}>
          {getFirestorePanel('Storage')}
        </Grid>
      </Grid>
    );
  };

  const getConfigPanel = () => {
    if (databaseType === 'local') {
      return getLocalPanel();
    } else if (databaseType === 'firestore') {
      return getFirestorePanel('Firestore');
    } else if (databaseType === 'mysql') {
      return getMysqlPanel();
    }
  };

  return (
    <div>
      <Tooltip title="Save Server settings">
        <Button
          style={{ float: 'right', marginBottom: 20, marginLeft: 20 }}
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
        >
          Configure
        </Button>
      </Tooltip>
      <Paper
        style={{
          margin: 'auto',
          overflow: 'hidden',
          clear: 'both',
          marginBottom: 20,
        }}
      >
        <div>
          <div class="element-container">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={9}>
                    <h1 class="element-header" style={{ marginTop: 0 }}>
                      Configuration
                    </h1>
                  </Grid>
                  <Grid item xs={3}>
                    <Tooltip title="setS Database Type For Project">
                      <NativeSelect
                        value={databaseType}
                        onChange={(e) => setDatabaseType(e.target.value)}
                        style={{ width: '100%', paddingTop: 7 }}
                      >
                        <option value={'local'}>Local</option>
                        <option value={'firestore'}>Firestore</option>
                        <option value={'mysql'}>MySQL</option>
                      </NativeSelect>
                    </Tooltip>
                  </Grid>
                </Grid>
                <Grid item xs={12} style={{ marginBottom: 30 }}>
                  <Accordion
                    style={{ clear: 'both' }}
                    onChange={(e) => setUpdateEmail(!updateEmail)}
                  >
                    <AccordionSummary
                      expandIcon={<KeyboardArrowDown />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>Email Configuration</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box
                        margin="auto"
                        width="90%"
                        display="flex"
                        flexDirection="column"
                        textAlign="center"
                        padding="16px"
                      >
                        <input
                          className="custom-input"
                          id="host"
                          name="host"
                          placeholder="Host"
                          value={host}
                          onChange={(e) => setHost(e.target.value)}
                          style={{ marginTop: '20px' }}
                        />
                        <input
                          className="custom-input"
                          id="port"
                          name="port"
                          placeholder="Port"
                          value={port}
                          onChange={(e) => setPort(e.target.value)}
                          style={{ marginTop: '20px' }}
                        />
                        <input
                          className="custom-input"
                          id="username"
                          name="username"
                          placeholder="Username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          style={{ marginTop: '20px' }}
                        />
                        <input
                          className="custom-input"
                          id="password"
                          name="password"
                          placeholder="Password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          style={{ marginTop: '20px' }}
                        />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
                {!isStateless ? (
                  <Grid item xs={12}>
                    {getConfigPanel()}
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
          </div>
          <div class="element-container">
            <div style={{ height: 40 }}></div>
          </div>
        </div>
        <LoadingDialog loading={loading} message={'Saving settings'} />
        <YesNoDialog
          open={open}
          closeDialog={handleClose}
          title={'Update configuration?'}
          message={
            'Are you sure you want to update the configuration? Doing so will overwrite current settings.'
          }
          action={setConfig}
          actionProcess={loading}
        />
        <MessageDialog
          open={messageOpen}
          closeDialog={handleMessageClose}
          title={'Error'}
          message={message}
        />
      </Paper>
    </div>
  );
};

export default Settings;
