// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("vendor");

messageAction("make");

if (Shell.fileExists("temp/build.done.flag")) {
	return;
};

if (!Shell.directoryExists("source")) {
	exitIf(Shell.system("7z x -aoa archive/" + Project.vendor + ".7z"));
	Shell.rename(Project.vendor, "source");
};

Shell.mkdirRecursivelyIfNotExists("output");
Shell.mkdirRecursivelyIfNotExists("output/bin");
Shell.mkdirRecursivelyIfNotExists("output/include");
Shell.mkdirRecursivelyIfNotExists("output/lib");
Shell.mkdirRecursivelyIfNotExists("temp");

Shell.mkdirRecursivelyIfNotExists("temp/cmake");

// required
if (Shell.directoryExists("../vendor-apr/output")) {
	exitIf(!Shell.copyDirRecursively("../vendor-apr/output", "output"));
} else {

	Shell.mkdirRecursivelyIfNotExists("vendor");
	var vendor = "apr-1.7.0-" + Platform.name + "-dev.7z";
	if (Shell.fileExists(pathRelease + "/" + vendor)) {
		Shell.copyFile(pathRelease + "/" + vendor, "vendor/" + vendor);
	} else if (Shell.fileExists("../vendor-apr/release/" + vendor)) {
		Shell.copyFile("../vendor-apr/release/" + vendor, "vendor/" + vendor);
	} else {
		var webLink = "https://github.com/g-stefan/vendor-apr/releases/download/v1.7.0/" + vendor;
		exitIf(Shell.system("curl --insecure --location " + webLink +
		                    " --output vendor/" + vendor));
	};
	exitIf(Shell.system("7z x -aoa -ooutput/ vendor/" + vendor));
};
//

if (!Shell.fileExists("temp/build.config.flag")) {
	Shell.copyFile("fabricare/CMakeLists.txt", "source/CMakeLists.txt");

	Shell.setenv("CC", "cl.exe");
	Shell.setenv("CXX", "cl.exe");

	cmdConfig = "cmake";
	cmdConfig += " ../../source";
	cmdConfig += " -G \"Ninja\"";
	cmdConfig += " -DCMAKE_BUILD_TYPE=Release";
	cmdConfig += " -DCMAKE_INSTALL_PREFIX=" + Shell.realPath(Shell.getcwd()) + "\\output";
	cmdConfig += " -DCMAKE_PREFIX_PATH=" + pathRepository;

	runInPath("temp/cmake", function() { exitIf(Shell.system(cmdConfig)); });

	Shell.filePutContents("temp/build.config.flag", "done");
};

runInPath("temp/cmake", function() {
	exitIf(Shell.system("ninja"));
	exitIf(Shell.system("ninja install"));
	exitIf(Shell.system("ninja clean"));
});

Shell.filePutContents("temp/build.done.flag", "done");
