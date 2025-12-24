from rag_core.graph.workflow import app
import os

try:
    print("Generating workflow diagram...")
    png_data = app.get_graph().draw_mermaid_png()
    
    output_path = "workflow_diagram.png"
    with open(output_path, "wb") as f:
        f.write(png_data)
        
    print(f"Diagram saved to {os.path.abspath(output_path)}")
except Exception as e:
    print(f"Error generating diagram: {e}")
    # Fallback to ascii if mermaid fails (e.g. missing dependencies)
    try:
        print("Attempting ASCII fallback...")
        app.get_graph().print_ascii()
    except Exception as e2:
        print(f"Error printing ASCII: {e2}")
