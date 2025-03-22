import ImageToText from "./ImgToText";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex-1">
        <ImageToText />
      </div>
      <footer className="text-center p-4 border-t border-gray-300">
        <p className="mb-2 text-sm text-gray-600">
          This tool runs entirely in your browser. No data is stored or sent to
          a server.
        </p>
        <p>
          Made by{" "}
          <a
            href="https://saad.cv/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-emerald-700"
          >
            saad
          </a>{" "}
          using{" "}
          <a
            href="https://github.com/naptha/tesseract.js"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-emerald-700"
          >
            tesseract.js
          </a>{" "}
          and{" "}
          <a
            href="https://nextjs.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-emerald-700"
          >
            next.js
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
