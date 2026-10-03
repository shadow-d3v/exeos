function removeJsonComments(source) {
  let output = "";
  let inString = false;
  let escaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const next = source[index + 1];

    if (inString) {
      output += character;
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === '"') {
        inString = false;
      }
      continue;
    }

    if (character === '"') {
      inString = true;
      output += character;
      continue;
    }

    if (character === "/" && next === "/") {
      index += 2;
      while (index < source.length && source[index] !== "\n") index += 1;
      if (index < source.length) output += "\n";
      continue;
    }

    if (character === "/" && next === "*") {
      index += 2;
      while (
        index < source.length &&
        !(source[index] === "*" && source[index + 1] === "/")
      ) {
        if (source[index] === "\n") output += "\n";
        index += 1;
      }
      index += 1;
      continue;
    }

    if (character === ",") {
      let lookahead = index + 1;
      while (/\s/.test(source[lookahead] || "")) lookahead += 1;
      if (source[lookahead] === "}" || source[lookahead] === "]") continue;
    }

    output += character;
  }

  return output;
}

async function loadCatalog() {
  const response = await fetch("data.jsonc");
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  const source = await response.text();
  const catalog = JSON.parse(removeJsonComments(source));
  const preferredOrder = [
    "windows-11",
    "windows-10",
    "ubuntu",
    "fedora",
    "mint",
  ];

  catalog.systems.sort((left, right) => {
    const leftIndex = preferredOrder.indexOf(left.id);
    const rightIndex = preferredOrder.indexOf(right.id);
    const leftRank = leftIndex === -1 ? preferredOrder.length : leftIndex;
    const rightRank = rightIndex === -1 ? preferredOrder.length : rightIndex;
    return leftRank - rightRank;
  });

  return catalog;
}
