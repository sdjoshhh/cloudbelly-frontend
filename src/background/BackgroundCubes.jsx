const BackgroundCubes = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-slate-50" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.10),transparent_26%),radial-gradient(circle_at_85%_25%,rgba(20,184,166,0.08),transparent_24%),radial-gradient(circle_at_55%_80%,rgba(139,92,246,0.07),transparent_22%)]" />

      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute top-1/4 -right-24 h-80 w-80 rounded-full bg-teal-200/25 blur-3xl" />
      <div className="absolute bottom-[-40px] left-1/3 h-72 w-72 rounded-full bg-violet-200/20 blur-3xl" />

      <div className="cube cube-a" />
      <div className="cube cube-b" />
      <div className="cube cube-c" />
    </div>
  );
};

export default BackgroundCubes;