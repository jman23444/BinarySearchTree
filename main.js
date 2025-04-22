
class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor(array) {
        // Sort and remove duplicates
        const sortedUniqueArray = [...new Set(array)].sort((a, b) => a - b);
        this.root = this.buildTree(sortedUniqueArray, 0, sortedUniqueArray.length - 1);
    }

    buildTree(arr, start, end) {
        if (start > end) return null;

        const mid = start + Math.floor((end - start) / 2);
        const node = new Node(arr[mid]);

        node.left = this.buildTree(arr, start, mid - 1);
        node.right = this.buildTree(arr, mid + 1, end);

        return node;
    }

    insert(value) {
        this.root = this.insertRecur(this.root, value);
    }

    insertRecur(node, value) {
        if (node === null) return new Node(value);

        if (value < node.data) {
            node.left = this.insertRecur(node.left, value);
        } else if (value > node.data) {
            node.right = this.insertRecur(node.right, value);
        }
        // Ignore duplicates
        return node;
    }

    deleteItem(value) {
        this.root = this.deleteRecur(this.root, value);
    }

    deleteRecur(node, value) {
        if (node === null) return null;

        if (value < node.data) {
            node.left = this.deleteRecur(node.left, value);
        } else if (value > node.data) {
            node.right = this.deleteRecur(node.right, value);
        } else {
            // Case 1: Leaf node
            if (node.left === null && node.right === null) {
                return null;
            }
            // Case 2: One child
            if (node.left === null) return node.right;
            if (node.right === null) return node.left;
            // Case 3: Two children
            const minNode = this.findMin(node.right);
            node.data = minNode.data;
            node.right = this.deleteRecur(node.right, minNode.data);
        }
        return node;
    }

    findMin(node) {
        let current = node;
        while (current.left !== null) {
            current = current.left;
        }
        return current;
    }

    find(value) {
        let current = this.root;
        while (current !== null) {
            if (value === current.data) return current;
            if (value < current.data) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        return null;
    }

    levelOrder(callback) {
        if (!callback) throw new Error("Callback function is required");

        const queue = [this.root];
        while (queue.length > 0) {
            const node = queue.shift();
            if (node === null) continue;
            callback(node);
            queue.push(node.left);
            queue.push(node.right);
        }
    }

    inOrder(callback) {
        if (!callback) throw new Error("Callback function is required");
        this.inOrderRecur(this.root, callback);
    }

    inOrderRecur(node, callback) {
        if (node === null) return;
        this.inOrderRecur(node.left, callback);
        callback(node);
        this.inOrderRecur(node.right, callback);
    }

    preOrder(callback) {
        if (!callback) throw new Error("Callback function is required");
        this.preOrderRecur(this.root, callback);
    }

    preOrderRecur(node, callback) {
        if (node === null) return;
        callback(node);
        this.preOrderRecur(node.left, callback);
        this.preOrderRecur(node.right, callback);
    }

    postOrder(callback) {
        if (!callback) throw new Error("Callback function is required");
        this.postOrderRecur(this.root, callback);
    }

    postOrderRecur(node, callback) {
        if (node === null) return;
        this.postOrderRecur(node.left, callback);
        this.postOrderRecur(node.right, callback);
        callback(node);
    }

    height(value) {
        const node = this.find(value);
        if (!node) return null;
        return this.heightRecur(node);
    }

    heightRecur(node) {
        if (node === null) return -1;
        const leftHeight = this.heightRecur(node.left);
        const rightHeight = this.heightRecur(node.right);
        return Math.max(leftHeight, rightHeight) + 1;
    }

    depth(value) {
        let current = this.root;
        let depth = 0;
        while (current !== null) {
            if (value === current.data) return depth;
            if (value < current.data) {
                current = current.left;
            } else {
                current = current.right;
            }
            depth++;
        }
        return null;
    }

    isBalanced() {
        return this.isBalancedRecur(this.root) !== -1;
    }

    isBalancedRecur(node) {
        if (node === null) return 0;

        const leftHeight = this.isBalancedRecur(node.left);
        if (leftHeight === -1) return -1;

        const rightHeight = this.isBalancedRecur(node.right);
        if (rightHeight === -1) return -1;

        if (Math.abs(leftHeight - rightHeight) > 1) return -1;

        return Math.max(leftHeight, rightHeight) + 1;
    }

    rebalance() {
        const values = [];
        this.inOrder(node => values.push(node.data));
        const sortedUniqueArray = [...new Set(values)].sort((a, b) => a - b);
        this.root = this.buildTree(sortedUniqueArray, 0, sortedUniqueArray.length - 1);
    }

    // Provided prettyPrint function
    prettyPrint(node = this.root, prefix = "", isLeft = true) {
        if (node === null) {
            return;
        }
        if (node.right !== null) {
            this.prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
        }
        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
        if (node.left !== null) {
            this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
        }
    }
}

// Driver script
function getRandomArray(size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * 100));
    }
    return arr;
}

// Create tree with random numbers
const randomArray = getRandomArray(10);
console.log("Initial array:", randomArray);
const tree = new Tree(randomArray);

// Confirm initial balance
console.log("\nIs tree balanced?", tree.isBalanced());
console.log("Initial tree structure:");
tree.prettyPrint();

// Print traversals
console.log("\nLevel order:");
tree.levelOrder(node => console.log(node.data));

console.log("\nPre-order:");
tree.preOrder(node => console.log(node.data));

console.log("\nIn-order:");
tree.inOrder(node => console.log(node.data));

console.log("\nPost-order:");
tree.postOrder(node => console.log(node.data));

// Unbalance the tree
console.log("\nAdding numbers > 100 to unbalance:");
tree.insert(150);
tree.insert(200);
tree.insert(300);
console.log("After adding large numbers:");
tree.prettyPrint();
console.log("Is tree balanced?", tree.isBalanced());

// Rebalance the tree
console.log("\nRebalancing tree:");
tree.rebalance();
console.log("After rebalancing:");
tree.prettyPrint();
console.log("Is tree balanced?", tree.isBalanced());

// Print traversals again
console.log("\nLevel order after rebalance:");
tree.levelOrder(node => console.log(node.data));

console.log("\nPre-order after rebalance:");
tree.preOrder(node => console.log(node.data));

console.log("\nIn-order after rebalance:");
tree.inOrder(node => console.log(node.data));

console.log("\nPost-order after rebalance:");
tree.postOrder(node => console.log(node.data));