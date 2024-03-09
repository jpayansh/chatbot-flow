import React from "react";

function Sidebar({ nameNode, setNameNode, selected, setSelectedNodes }) {
  const handleName = (e) => {
    setNameNode(e.target.value);
  };

  const dragStart = (e, TextNode) => {
    e.dataTransfer.setData("application/reactflow", TextNode);
    e.dataTransfer.effectAllowed = "move";
  };
  return (
    <aside className="border border-r-2 border-indigo-300 p-4 text-sm w-64 h-screen text-black">
      {selected ? (
        <div>
          <h3 className="text-xl mb-2 text-indigo-400">Update Node</h3>
          <label className="block mb-2 text-sm font-medium text-indigo-900">
            Node Name:
          </label>
          <input
            type="text"
            className="block w-full pt-2 px-3 pb-3 text-indigo-800 border border-indigo-300 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
            value={nameNode}
            onChange={(e) => handleName(e)}
          />
          <button
            className="mt-4 bg-indigo-500 text-white rounded p-2 hover:bg-indigo-600"
            onClick={() => setSelectedNodes([])}
          >
            Go Back
          </button>
        </div>
      ) : (
        <>
          <h3 className="text-xl mb-4 text-indigo-900">Node Panel</h3>
          <div
            className="bg-white p-3 border-2 border-indigo-500 rounded cursor-move flex justify-center items-center text-indigo-500 hover:bg-indigo-500 hover:text-white transition-colors duration-200"
            draggable
            onDragStart={(e) => {
              dragStart(e, "textnode");
            }}
          >
            Message Nodes
          </div>
        </>
      )}
    </aside>
  );
}

export default Sidebar;
