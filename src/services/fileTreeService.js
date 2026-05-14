export function groupFiles(files) {

  const tree = {};

  files.forEach((file) => {

    const parts =
      file.fileName.split("/");

    let current = tree;

    parts.forEach((part, index) => {

      const isFile =
        index === parts.length - 1;

      if (!current[part]) {

        current[part] = isFile
          ? file
          : {};
      }

      current = current[part];
    });
  });

  return tree;
}