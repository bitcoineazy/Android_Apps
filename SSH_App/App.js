import React, { Component } from "react";
import {
  Alert,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SegmentedControls } from "react-native-radio-buttons";
import { TextField } from "react-native-material-textfield";

import SSHClient from "react-native-ssh-sftp";
import Dialog from "react-native-dialog";

const requestStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "SSH App",
        message: "SSH App access to your external storage ",
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the storage");
    } else {
      console.log("Storage permission denied");
      alert("Storage permission denied, you cant download or upload files");
    }
  } catch (err) {
    console.warn(err);
  }
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      host: "192.168.1.2",
      port: "22",
      username: "---",
      password: "---",
      privateKey:
        "\
      -----BEGIN RSA PRIVATE KEY-----\n\
      MIIEpAIBAAKCAQEA2DdFSeWG8wOHddRpOhf4FRqksJITr59iXdNrXq+n79QFN1g4\n\
      -----END RSA PRIVATE KEY-----",
      selectedOption: "Execute",
      command: "ps",
      exeOutput: "",
      shellOutput: "",
      sftpOutput: [],
      currentPath: "",
      renameDialogVisible: false,
      pathToRename: "",
      newRenamedPath: "",
    };
  }

  async componentWillMount() {
    await requestStoragePermission();
  }

  connect() {
    let {
      host,
      port,
      username,
      password,
      privateKey,
      selectedOption,
      command,
      exeClient,
      exeOutput,
      shellClient,
      shellOutput,
      sftpClient,
      sftpOutput,
    } = this.state;

    switch (selectedOption) {
      case "Execute":
        if (!exeClient) {
          let exeClient = new SSHClient(
            host,
            parseInt(port),
            username,
            password.length > 0 ? password : { privateKey },
            (error) => {
              if (!error) {
                exeClient.execute(command, (error, output) => {
                  this.setState({
                    exeClient,
                    exeOutput: error ? error : output,
                  });
                });
              } else {
                this.setState({ exeOutput: error });
              }
            }
          );
        } else {
          exeClient.execute(command, (error, output) => {
            this.setState({ exeOutput: error ? error : output });
          });
        }
        break;
      case "Shell":
        if (!shellClient) {
          let shellClient = new SSHClient(
            host,
            parseInt(port),
            username,
            password.length > 0 ? password : { privateKey },
            (error) => {
              if (!error) {
                this.setState({ shellClient });
                shellClient.startShell("vanilla", (error) => {
                  if (error) this.setState({ shellOutput: error });
                });
                shellClient.on("Shell", (event) => {
                  let { shellOutput } = this.state;
                  this.setState({ shellOutput: shellOutput + event });
                });
              } else {
                this.setState({ shellOutput: error });
              }
            }
          );
        }
        break;
      default:
        if (!sftpClient) {
          let sftpClient = new SSHClient(
            host,
            parseInt(port),
            username,
            password.length > 0 ? password : { privateKey },
            (error) => {
              if (!error) {
                this.setState({ sftpClient });
                sftpClient.connectSFTP((error) => {
                  if (error) {
                    console.warn(error);
                  } else {
                    this.listDirectory(".");
                    this.setState({ currentPath: "./" });
                  }
                });
              } else {
                console.warn(error);
                this.setState({ shellOutput: error });
              }
            }
          );
        }
    }
  }

  writeToShell(event) {
    let { shellClient, shellOutput } = this.state;
    if (shellClient) {
      shellClient.writeToShell(event.nativeEvent.text + "\n", (error) => {
        if (error) this.setState({ shellOutput: shellOutput + error });
      });
    }
    this.textInput.clear();
  }

  enterDirectory(dir) {
    let { currentPath } = this.state;
    const newPath = currentPath + dir;
    this.setState({ currentPath: newPath });
    this.listDirectory(newPath);
  }

  downloadFile(file) {
    const { sftpClient } = this.state;
    if (sftpClient) {
      sftpClient.sftpDownload(
        file,
        "/storage/emulated/0/Download",
        (error, downloadedFilePath) => {
          if (error) Alert.alert(error);
          if (downloadedFilePath)
            Alert.alert(
              "Successfully downloaded in: " + "/storage/emulated/0/Download"
            );
        }
      );
    }
  }

  renameFile(path, newPath) {
    console.log(path, newPath);
    const { sftpClient } = this.state;
    if (sftpClient) {
      sftpClient.sftpRename(path, newPath, (error) => {
        if (error) console.warn(error);
        else {
          Alert.alert("Successfully renamed");
        }
      });
    }
  }

  listDirectory(path) {
    let { sftpClient } = this.state;
    if (sftpClient) {
      sftpClient.sftpLs(path, (error, response) => {
        if (error) {
          console.warn(error);
        } else {
          this.setState({ sftpOutput: response });
        }
      });
    }
  }

  goBack() {
    let { currentPath } = this.state;
    const newPath = currentPath.substring(
      0,
      currentPath.slice(0, -1).lastIndexOf("/") + 1
    );
    this.setState({ currentPath: newPath });
    this.listDirectory(newPath);
  }

  componentWillUnmount() {
    let { exeClient, shellClient, sftpClient } = this.state;
    if (exeClient) exeClient.disconnect();
    if (shellClient) shellClient.disconnect();
    if (sftpClient) sftpClient.disconnect();
  }

  render() {
    const options = ["Execute", "Shell", "SFTP"];

    let {
      host,
      port,
      username,
      password,
      privateKey,
      selectedOption,
      command,
      exeOutput,
      shellOutput,
      shellClient,
      sftpOutput,
      currentPath,
      renameDialogVisible,
      pathToRename,
      newRenamedPath,
    } = this.state;

    const renderSFTP = () => {
      if (sftpOutput.length > 0)
        return sftpOutput.map((file, id) => {
          const f = JSON.parse(file);
          return (
            <View key={id}>
              {f["isDirectory"] === 1 ? (
                <TouchableOpacity
                  onPress={this.enterDirectory.bind(this, f["filename"])}
                >
                  <Text style={styles.directory}>{f["filename"]}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={this.downloadFile.bind(
                    this,
                    currentPath + f["filename"]
                  )}
                  onLongPress={() =>
                    this.setState({
                      renameDialogVisible: true,
                      pathToRename: currentPath + f["filename"],
                    })
                  }
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ textAlign: "left" }}>{f["filename"]}</Text>
                    <Text style={{ textAlign: "right" }}>
                      {" "}
                      {(f["fileSize"] / 1024).toFixed(2)} Kb
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          );
        });
    };

    const handleRenameConfirm = () => {
      this.renameFile(
        this.state.pathToRename.length > 0
          ? this.state.pathToRename
          : this.setState({ renameDialogVisible: false }),
        this.state.newRenamedPath
      );
      this.setState({ renameDialogVisible: false });
    };

    return (
      <ScrollView
        style={styles.container}
        ref={(ref) => (this.scrollView = ref)}
        onContentSizeChange={(contentWidth, contentHeight) => {
          this.scrollView.scrollToEnd({ animated: true });
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 2, marginRight: 10 }}>
            <TextField
              labelHeight={15}
              label="Host"
              value={host}
              onChangeText={(host) => this.setState({ host })}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextField
              labelHeight={15}
              label="Port"
              value={port}
              onChangeText={(port) => this.setState({ port })}
            />
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <TextField
              labelHeight={15}
              label="Username"
              value={username}
              onChangeText={(username) => this.setState({ username })}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextField
              labelHeight={15}
              label="Password"
              value={password}
              onChangeText={(password) => this.setState({ password })}
            />
          </View>
        </View>
        <TextField
          labelHeight={15}
          fontSize={privateKey.length < 1 ? 16 : 8}
          label="Private Key"
          value={privateKey}
          multiline={true}
          onChangeText={(privateKey) => this.setState({ privateKey })}
        />
        <View style={{ marginTop: 10 }} />
        <SegmentedControls
          options={options}
          onSelection={(selectedOption) => this.setState({ selectedOption })}
          selectedOption={selectedOption}
        />
        {selectedOption === "Execute" ? (
          <TextField
            labelHeight={20}
            label="Command"
            value={command}
            autoCapitalize="none"
            onChangeText={(command) => this.setState({ command })}
          />
        ) : (
          <View style={{ marginTop: 10 }} />
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={this.connect.bind(this)}
        >
          <Text style={styles.buttonText}>
            {selectedOption === "Execute" ? "Run" : "Connect"}
          </Text>
        </TouchableOpacity>
        {selectedOption === "Execute" ? (
          <View style={styles.outputContainer}>
            <Text>{exeOutput}</Text>
          </View>
        ) : selectedOption === "Shell" ? (
          <View style={styles.outputContainer}>
            <Text style={{ fontSize: 12 }}>{shellOutput}</Text>
            {shellClient ? (
              <TextInput
                underlineColorAndroid="transparent"
                ref={(input) => {
                  this.textInput = input;
                }}
                autoFocus={true}
                autoCapitalize="none"
                style={styles.shellInput}
                onSubmitEditing={this.writeToShell.bind(this)}
              />
            ) : undefined}
          </View>
        ) : selectedOption === "SFTP" ? (
          <View style={styles.outputContainer}>
            <TouchableOpacity onPress={this.goBack.bind(this)}>
              <Text style={{ padding: 4 }}>{currentPath}</Text>
            </TouchableOpacity>
            <View>{renderSFTP()}</View>
            <Dialog.Container visible={this.state.renameDialogVisible}>
              <Dialog.Title>Rename file or directory</Dialog.Title>
              <Dialog.Description>Input new name</Dialog.Description>
              <Dialog.Input
                label="New name"
                onChangeText={(newRenamedPath) =>
                  this.setState({
                    newRenamedPath: currentPath + newRenamedPath,
                  })
                }
              />
              <Dialog.Button
                label="Cancel"
                onPress={() => this.setState({ renameDialogVisible: false })}
              />
              <Dialog.Button label="Rename" onPress={handleRenameConfirm} />
            </Dialog.Container>
          </View>
        ) : undefined}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    padding: 20,
  },
  buttonText: {
    fontSize: 16,
    alignSelf: "center",
    color: "#007AFF",
  },
  button: {
    height: 36,
    marginTop: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
    alignSelf: "stretch",
    justifyContent: "center",
  },
  outputContainer: {
    flex: 1,
    marginTop: 15,
    marginBottom: 20,
  },
  shellInput: {
    backgroundColor: "#eee",
    fontSize: 11,
    marginBottom: 20,
  },
  file: {
    padding: 4,
    color: "grey",
  },
  directory: {
    padding: 4,
    color: "black",
  },
});
