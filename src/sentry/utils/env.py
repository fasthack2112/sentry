import sys


def in_test_environment():
    return sys.argv[0] in {"pytest", "vscode"}
