

const PdfIframeViewer = ({ pdfUrl }) => {
  return (
  
      <iframe
        src={pdfUrl}
        title="PDF Viewer"
        style={{ width: "100%", height: "100vh", border: "none" }}
      />
  );
};

export default PdfIframeViewer;
