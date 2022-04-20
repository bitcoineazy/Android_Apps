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
import {
  DocumentPicker,
  DocumentPickerUtil,
} from "react-native-document-picker";
import RNFetchBlob from "react-native-fetch-blob";

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
      username: "noble6",
      password: "123",
      privateKey:
          "\
        -----BEGIN RSA PRIVATE KEY-----\n\
        YOUR_PRIVATE_KEY\n\
        -----END RSA PRIVATE KEY-----",
      selectedOption: "Execute",
      command: "ps",
      exeOutput: "",
      shellOutput: "",
      sftpOutput: [],
      currentPath: "",
      fileMenuDialogVisible: false,
      directoryMenuDialogVisible: false,
      renameDialogVisible: false,
      createDirectoryDialogVisible: false,
      deleteDialogVisible: false,
      deleteDirectoryDialogVisible: false,
      uploadDialogVisible: false,
      manageCurrentDirectory: false,
      pathLongPress: "",
      newDirectoryPath: "",
      newRenamedPath: "",
      uploadFileLocalURI: "",
    };
  }

  async componentDidMount() {
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
                  shellClient.startShell("vt100", (error) => {
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

  downloadFile(path) {
    const { sftpClient } = this.state;
    if (sftpClient) {
      sftpClient.sftpDownload(
          path,
          RNFetchBlob.fs.dirs.DownloadDir,
          (error, downloadedFilePath) => {
            if (error) Alert.alert(error);
            if (downloadedFilePath)
              Alert.alert("Successfully downloaded in:", downloadedFilePath);
          }
      );
      sftpClient.on("DownloadProgress", (event) => {
        console.log(event);
      });
    }
  }

  uploadFile(localPath, remotePath) {
    const { sftpClient } = this.state;
    if (sftpClient) {
      sftpClient.sftpUpload(localPath, remotePath, (error) => {
        if (error) Alert.alert(error);
        else {
          Alert.alert(
              "Successfully uploaded file:",
              "from: " + localPath + "\nto: " + remotePath
          );
          this.updateDirectory();
        }
      });
      sftpClient.on("UploadProgress", (event) => {
        console.log(event);
      });
    }
  }

  renameFile(path, newPath) {
    console.log(path, newPath);
    const { sftpClient } = this.state;
    if (sftpClient) {
      sftpClient.sftpRename(path, newPath, (error) => {
        if (error) console.warn(error);
        else {
          Alert.alert("Successfully renamed", path + " -> \n" + newPath);
          this.updateDirectory();
        }
      });
    }
  }

  deleteFile(path) {
    const { sftpClient } = this.state;
    if (sftpClient) {
      sftpClient.sftpRm(path, (error) => {
        if (error) console.warn(error);
        else {
          Alert.alert("Successfully deleted file:", path);
          this.updateDirectory();
        }
      });
    }
  }

  createDirectory(path) {
    const { sftpClient } = this.state;
    if (sftpClient) {
      sftpClient.sftpMkdir(path, (error) => {
        if (error) console.warn(error);
        else {
          Alert.alert("Successfully created directory:", path);
          this.updateDirectory();
        }
      });
    }
  }

  deleteDirectory(path) {
    const { sftpClient } = this.state;
    if (sftpClient) {
      sftpClient.sftpRmdir(path, (error) => {
        if (error) console.warn(error);
        else {
          Alert.alert("Successfully deleted directory:", path);
          this.updateDirectory();
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

  enterDirectory(directory) {
    let { currentPath } = this.state;
    const newPath = currentPath + directory;
    this.setState({ currentPath: newPath });
    this.listDirectory(newPath);
  }

  updateDirectory() {
    this.listDirectory(this.state.currentPath);
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
      fileMenuDialogVisible,
      renameDialogVisible,
      pathLongPress,
      newRenamedPath,
    } = this.state;

    const handleRenameConfirm = () => {
      this.renameFile(
          this.state.pathLongPress.length > 0
              ? this.state.pathLongPress
              : this.setState({ renameDialogVisible: false }),
          this.state.newRenamedPath
      );
      this.setState({ renameDialogVisible: false });
    };

    //Манипуляции чтобы переименовать верхний уровень
    const handleRenameInputChangeText = (newRenamedPath) => {
      if (!this.state.manageCurrentDirectory) {
        this.setState({
          newRenamedPath: currentPath + newRenamedPath,
        });
      } else {
        this.goBack(); // меняем currentPath один раз на уровень вверх
        this.setState({ manageCurrentDirectory: false });
      }
    };

    const handleDeleteConfirm = () => {
      this.deleteFile(
          this.state.pathLongPress.length > 0
              ? this.state.pathLongPress
              : this.setState({ deleteDialogVisible: false })
      );
      this.setState({ deleteDialogVisible: false });
    };

    const handleCreateDirectoryConfirm = () => {
      this.createDirectory(
          this.state.newDirectoryPath.length > 0
              ? this.state.newDirectoryPath
              : this.setState({ createDirectoryDialogVisible: false })
      );
      this.setState({ createDirectoryDialogVisible: false });
    };

    const handleDeleteDirectoryConfirm = async () => {
      console.log(this.state.pathLongPress);
      // Если находимся в той же директории, которую удаляем, то перемещаемся на уровень выше
      if (this.state.manageCurrentDirectory) {
        this.setState({ manageCurrentDirectory: false });
        // Ждём пока переместимся выше
        await this.goBack();
      }
      this.deleteDirectory(
          this.state.pathLongPress.length > 0
              ? this.state.pathLongPress
              : this.setState({ deleteDirectoryDialogVisible: false })
      );
      this.setState({ deleteDirectoryDialogVisible: false });
    };

    // Извлекаем абсолютный путь файла на устройстве по URI для загрузки на сервер
    const handleUploadFileConfirm = () => {
      DocumentPicker.show(
          {
            filetype: [DocumentPickerUtil.allFiles()],
          },
          (error, res) => {
            RNFetchBlob.fs
                .stat(res.uri)
                .then((stats) => {
                  console.log("Path: " + stats.path);
                  this.uploadFile(
                      stats.path,
                      this.state.pathLongPress.length > 0
                          ? this.state.pathLongPress
                          : this.setState({ uploadDialogVisible: false })
                  );
                  this.setState({ uploadDialogVisible: false });
                })
                .catch((error) => {
                  Alert.alert(
                      "Error opening file",
                      "Please choose file from filesystem, not from quick launch menu"
                  );
                });
          }
      );
    };

    const renderSFTP = () => {
      if (sftpOutput.length > 0)
        return sftpOutput.map((file, id) => {
          const f = JSON.parse(file);
          return (
              <View key={id}>
                {f["isDirectory"] === 1 ? (
                    <TouchableOpacity
                        onPress={this.enterDirectory.bind(this, f["filename"])}
                        onLongPress={() =>
                            this.setState({
                              directoryMenuDialogVisible: true,
                              pathLongPress: currentPath + f["filename"],
                            })
                        }
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
                              fileMenuDialogVisible: true,
                              pathLongPress: currentPath + f["filename"],
                            })
                        }
                    >
                      <View style={{ flexDirection: "row" }}>
                        <Text
                            style={{ textAlign: "left", padding: 4, fontSize: 16 }}
                        >
                          {f["filename"]}
                        </Text>
                        <Text
                            style={{ textAlign: "right", padding: 4, fontSize: 16 }}
                        >
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
          <Text>Hello im a progress bar</Text>
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
                <Text selectable>{exeOutput}</Text>
              </View>
          ) : selectedOption === "Shell" ? (
              <View style={styles.outputContainer}>
                <Text selectable style={{ fontSize: 12 }}>
                  {shellOutput}
                </Text>
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
                <TouchableOpacity
                    onPress={this.goBack.bind(this)}
                    onLongPress={() =>
                        this.setState({
                          directoryMenuDialogVisible: true,
                          pathLongPress: currentPath,
                          manageCurrentDirectory: true,
                        })
                    }
                >
                  <Text style={{ padding: 4, color: "#007AFF", fontSize: 18 }}>
                    {currentPath}
                  </Text>
                </TouchableOpacity>
                <View>{renderSFTP()}</View>
                <Dialog.Container visible={this.state.fileMenuDialogVisible}>
                  <Dialog.Title style={{ textAlign: "center" }}>
                    File menu
                  </Dialog.Title>
                  <Dialog.Description
                      style={{
                        textAlign: "center",
                        marginTop: 15,
                        fontWeight: "bold",
                      }}
                  >
                    Choose option for file management
                  </Dialog.Description>
                  <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 15,
                      }}
                  >
                    <Dialog.Button
                        style={styles.dialogButton}
                        label="Rename"
                        onPress={() =>
                            this.setState({
                              fileMenuDialogVisible: false,
                              renameDialogVisible: true,
                            })
                        }
                    />
                    <Dialog.Button
                        style={styles.dialogButton}
                        label="Delete"
                        onPress={() =>
                            this.setState({
                              fileMenuDialogVisible: false,
                              deleteDialogVisible: true,
                            })
                        }
                    />
                    <Dialog.Button
                        style={styles.dialogButton}
                        label="Cancel"
                        onPress={() =>
                            this.setState({ fileMenuDialogVisible: false })
                        }
                    />
                  </View>
                </Dialog.Container>
                <Dialog.Container visible={this.state.directoryMenuDialogVisible}>
                  <Dialog.Title style={{ textAlign: "center" }}>
                    Directory menu
                  </Dialog.Title>
                  <Dialog.Description
                      style={{
                        textAlign: "center",
                        marginTop: 15,
                        fontWeight: "bold",
                      }}
                  >
                    Choose option for directory management
                  </Dialog.Description>
                  <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 15,
                      }}
                  >
                    <Dialog.Button
                        style={styles.dialogButton}
                        label="Create directory"
                        onPress={() =>
                            this.setState({
                              directoryMenuDialogVisible: false,
                              createDirectoryDialogVisible: true,
                            })
                        }
                    />
                    <Dialog.Button
                        style={styles.dialogButton}
                        label="Rename directory"
                        onPress={() =>
                            this.setState({
                              directoryMenuDialogVisible: false,
                              renameDialogVisible: true,
                            })
                        }
                    />
                    <Dialog.Button
                        style={styles.dialogButton}
                        label="Delete directory"
                        onPress={() =>
                            this.setState({
                              directoryMenuDialogVisible: false,
                              deleteDirectoryDialogVisible: true,
                            })
                        }
                    />
                    <Dialog.Button
                        style={styles.dialogButton}
                        label="Upload file"
                        onPress={() =>
                            this.setState({
                              directoryMenuDialogVisible: false,
                              uploadDialogVisible: true,
                            })
                        }
                    />
                    <Dialog.Button
                        style={styles.dialogButton}
                        label="Cancel"
                        onPress={() =>
                            this.setState({ directoryMenuDialogVisible: false })
                        }
                    />
                  </View>
                </Dialog.Container>
                <Dialog.Container visible={this.state.renameDialogVisible}>
                  <Dialog.Title>Rename file or directory</Dialog.Title>
                  <Dialog.Description>Input new name</Dialog.Description>
                  <Dialog.Input
                      label="New name"
                      onChangeText={
                        (newRenamedPath) =>
                            handleRenameInputChangeText(newRenamedPath)
                      }
                  />
                  <Dialog.Button
                      label="Cancel"
                      onPress={() => this.setState({ renameDialogVisible: false })}
                  />
                  <Dialog.Button label="Rename" onPress={handleRenameConfirm} />
                </Dialog.Container>
                <Dialog.Container visible={this.state.createDirectoryDialogVisible}>
                  <Dialog.Title>Create new directory</Dialog.Title>
                  <Dialog.Description>Input new directory name</Dialog.Description>
                  <Dialog.Input
                      label="Directory name"
                      onChangeText={(newDirectoryPath) =>
                          this.setState({
                            newDirectoryPath: pathLongPress + newDirectoryPath,
                          })
                      }
                  />
                  <Dialog.Button
                      label="Cancel"
                      onPress={() =>
                          this.setState({ createDirectoryDialogVisible: false })
                      }
                  />
                  <Dialog.Button
                      label="Create"
                      onPress={handleCreateDirectoryConfirm}
                  />
                </Dialog.Container>
                <Dialog.Container visible={this.state.deleteDialogVisible}>
                  <Dialog.Title>Delete file</Dialog.Title>
                  <Dialog.Description>
                    Are you sure you want to delete this file?
                  </Dialog.Description>
                  <Dialog.Button
                      label="Cancel"
                      onPress={() => this.setState({ deleteDialogVisible: false })}
                  />
                  <Dialog.Button label="Delete" onPress={handleDeleteConfirm} />
                </Dialog.Container>
                <Dialog.Container visible={this.state.deleteDirectoryDialogVisible}>
                  <Dialog.Title>Delete directory</Dialog.Title>
                  <Dialog.Description>
                    Are you sure you want to delete this directory?
                  </Dialog.Description>
                  <Dialog.Button
                      label="Cancel"
                      onPress={() =>
                          this.setState({ deleteDirectoryDialogVisible: false })
                      }
                  />
                  <Dialog.Button
                      label="Delete"
                      onPress={handleDeleteDirectoryConfirm}
                  />
                </Dialog.Container>
                <Dialog.Container visible={this.state.uploadDialogVisible}>
                  <Dialog.Title>Upload file to server</Dialog.Title>
                  <Dialog.Description>
                    Choose file from your device to upload on server
                  </Dialog.Description>
                  <Dialog.Button
                      label="Cancel"
                      onPress={() => this.setState({ uploadDialogVisible: false })}
                  />
                  <Dialog.Button label="Upload" onPress={handleUploadFileConfirm} />
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
  dialogButton: {
    fontWeight: "bold",
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
    fontSize: 16,
  },
});
