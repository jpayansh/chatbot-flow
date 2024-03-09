import React, { useState, useEffect, useRef, useMemo } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Controls,
  Background,
} from "reactflow";
import "reactflow/dist/base.css";
import Sidebar from "./component/SideBar";
import TextNode from "./component/TextNode";
const initialNodes = [
  {
    id: "1",
    type: "textnode",
    data: { label: "input nodes" },
    position: { x: 250, y: 5 },
  },
];
let id = 0;
const getId = () => `dndnode_${id++}`;

function App() {
  const nodeTypes = useMemo(
    () => ({
      textnode: TextNode,
    }),
    []
  );
  const [selectedElements, setSelectedElements] = useState([]);
  const [nodeName, setNodeName] = useState("");
  const reactFlowWrapper = useRef(null);

  const [reactFlowInstance, setReactFlowInstance] = useState();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (selectedElements.length > 0) {
      setNodes((data) =>
        data.map((node) => {
          if (node.id === selectedElements[0]?.id) {
            node.data = {
              ...node.data,
              label: nodeName,
            };
          }
          return node;
        })
      );
    } else {
      setNodeName("");
    }
  }, [nodeName, selectedElements, setNodes]);

  const { setViewport } = useReactFlow();
  const onNodeClick = (e, node) => {
    setSelectedElements([node]);
    setNodeName(node.data.label);
    setNodes((nodes) =>
      nodes.map((n) => ({
        ...n,
        selected: n.id === node.id,
      }))
    );
  };

  const checkEmptyTargetHandles = () => {
    let emptyTargetHandles = 0;
    edges.forEach((edge) => {
      if (!edge.targetHandle) {
        emptyTargetHandles++;
      }
    });
    return emptyTargetHandles;
  };
  const isNodeUnconnected = () => {
    let unconnectedNodes = nodes.filter(
      (node) =>
        !edges.find(
          (edge) => edge.source === node.id || edge.target === node.id
        )
    );

    return unconnectedNodes.length > 0;
  };

  const Save = () => {
    if (reactFlowInstance) {
      const emptyTargetHandles = checkEmptyTargetHandles();

      if (nodes.length > 1 && (emptyTargetHandles > 1 || isNodeUnconnected())) {
        alert(
          "Error: More than one node has an empty target handle or there are unconnected nodes."
        );
      } else {
        const flow = reactFlowInstance.toObject();
        localStorage.setItem("Node", JSON.stringify(flow));
        alert("Save successful!");
      }
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const onConnect = (node) => {
    setEdges((es) => addEdge(node, es));
  };

  const onDrop = (e) => {
    e.preventDefault();

    if (reactFlowInstance) {
      const type = e.dataTransfer.getData("application/reactflow");
      const position = reactFlowInstance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    }
  };

  return (
    <div className="flex flex-col min-h-screen lg:flex-col">
      <div className="bg-indigo-100 p-3">
        <button
          className="m-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-9 rounded"
          onClick={() => Save()}
        >
          Save
        </button>
      </div>
      <div className="flex flex-row lg:flex-row">
        <div className="flex-grow h-screen" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={() => {
              setSelectedElements([]);
              setNodes((nodes) =>
                nodes.map((n) => ({
                  ...n,
                  selected: false,
                }))
              );
            }}
            fitView
          >
            <Background variant="dots" />
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar
          nameNode={nodeName}
          setNameNode={setNodeName}
          selected={selectedElements[0]}
          setSelectedNodes={setSelectedElements}
        />
      </div>
    </div>
  );
}

function FlowWithProvider() {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}

export default FlowWithProvider;
